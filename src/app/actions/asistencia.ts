'use server';

import pool from '@/lib/db_asistencia';
import { RowDataPacket } from 'mysql2';

interface RegisterResponse {
    success: boolean;
    message: string;
    empleado?: string;
    tipo?: 'entrada' | 'salida';
    hora?: string;
    requiresConfirmation?: boolean;
}

// Helper para registrar intentos fallidos
async function logFailure(empleadoId: number, tipo: 'entrada' | 'salida' | 'desconocido', motivo: string) {
    try {
        await pool.execute(
            'INSERT INTO auditoria_accesos (empleado_id, fecha_hora, tipo_intento, motivo) VALUES (?, NOW(), ?, ?)',
            [empleadoId, tipo, motivo]
        );
    } catch (e) {
        console.error('Error logging audit failure:', e);
    }
}

export async function registrarAsistencia(dni: string, confirmarSalidaAnticipada: boolean = false): Promise<RegisterResponse> {
    let connection;
    try {
        connection = await pool.getConnection();

        // 1. Validar Empleado y Obtener Reglas de Turno
        const [rows] = await connection.execute<RowDataPacket[]>(`
      SELECT e.id, e.nombres, e.apellidos, e.permite_horas_extras,
             t.hora_entrada, t.hora_salida, t.margen_tolerancia_minutos
      FROM empleados e
      LEFT JOIN turnos t ON e.turno_id = t.id
      WHERE e.dni = ? AND e.estado = "activo"
    `, [dni]);

        if (rows.length === 0) {
            return { success: false, message: 'DNI no encontrado o empleado inactivo.' };
        }

        const emp = rows[0];
        const empleadoId = emp.id;
        const nombreCompleto = `${emp.nombres} ${emp.apellidos}`;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();

        // Configuración de zona horaria: El servidor ya debería tener TZ correcta, pero usamos getHours/getMinutes locales
        const currentTimeStr = now.toLocaleTimeString('en-US', { hour12: false }); // HH:MM:SS

        // Validar Fin de Semana
        const dayOfWeek = now.getDay(); // 0 = Domingo, 6 = Sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Validar Feriado
        const [feriados] = await connection.execute<RowDataPacket[]>('SELECT descripcion FROM feriados WHERE fecha = ?', [today]);
        const isHoliday = feriados.length > 0;
        const holidayName = isHoliday ? feriados[0].descripcion : '';

        const isNonWorkingDay = isWeekend || isHoliday;

        // Si es día no laborable y NO tiene permiso de extras -> Bloquear Entrada
        // (Solo si no está saliendo de una sesión activa, lo cual se chequea más abajo, 
        // pero para evitar lógica cruzada, chequeamos session activa primero o permitimos flow hasta el Insert)

        // Parse time helper (HH:MM:SS -> Date object for today)
        const getDateFromTime = (timeStr: string) => {
            const [h, m, s] = timeStr.split(':').map(Number);
            const d = new Date(now);
            d.setHours(h, m, s || 0, 0);
            return d;
        };

        // Si tiene turno asignado, validamos reglas
        let mensajeError = '';
        if (emp.hora_entrada && emp.hora_salida) {
            const turnoEntrada = getDateFromTime(emp.hora_entrada);
            const turnoSalida = getDateFromTime(emp.hora_salida);

            // Tolerancia 30 min antes/despues
            const minEntrada = new Date(turnoEntrada.getTime() - 30 * 60000);
            const maxSalidaSinExtras = new Date(turnoSalida.getTime() + 30 * 60000);

            // Debug info (console only)
            console.log(`Now: ${now}, MinEntrada: ${minEntrada}, MaxSalida: ${maxSalidaSinExtras}, OT: ${emp.permite_horas_extras}`);

            // REGLA 1: No marcar MUY temprano (antes de 30 min de entrada)
            // Solo aplica si es CHECK-IN (no hay sesion activa)
            const [active] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM asistencias WHERE empleado_id = ? AND fecha = ? AND hora_salida IS NULL',
                [empleadoId, today]
            );

            if (active.length === 0) {
                // Es Entrada
                if (now < minEntrada) {
                    const msg = `Muy temprano. Tu turno inicia ${emp.hora_entrada}.`;
                    await logFailure(empleadoId, 'entrada', msg);
                    return { success: false, message: msg };
                }

                // REGLA 1.1: No marcar Entrada si el turno YA TERMINÓ (salvo extras)
                if (now > maxSalidaSinExtras && emp.permite_horas_extras !== 1) {
                    const msg = 'Fuera de horario. El turno ha finalizado.';
                    await logFailure(empleadoId, 'entrada', msg);
                    return { success: false, message: msg };
                }
            } else {
                // Es Salida
                // REGLA 2: Si marca despues de tolerancia y NO tiene OT -> BLOQUEAR
                if (now > maxSalidaSinExtras && emp.permite_horas_extras !== 1) {
                    const msg = 'Fuera de horario. No tienes horas extras autorizadas.';
                    await logFailure(empleadoId, 'salida', msg);
                    return { success: false, message: msg };
                }
            }
        }

        // 2. Buscar último registro del día
        const [activeSessions] = await connection.execute<RowDataPacket[]>(
            'SELECT id, hora_entrada FROM asistencias WHERE empleado_id = ? AND fecha = ? AND hora_salida IS NULL ORDER BY created_at DESC LIMIT 1',
            [empleadoId, today]
        );

        // 3. Lógica de Entrada/Salida
        if (activeSessions.length > 0) {
            // === SALIDA (CHECK-OUT) ===
            const sessionId = activeSessions[0].id;

            // Validar Salida Anticipada
            if (emp.hora_salida && !confirmarSalidaAnticipada) {
                const turnoSalida = getDateFromTime(emp.hora_salida);
                // Si intenta salir antes de la hora de salida (sin tolerancia, estricto o con margen negativo si se quisiera)
                // Aquí usamos estricto: si es antes de hora_salida, avisa.
                if (now < turnoSalida) {
                    return {
                        success: false,
                        message: `Tu turno termina a las ${emp.hora_salida}. ¿Confirmas retirarte antes?`,
                        requiresConfirmation: true
                    };
                }
            }

            await connection.execute(
                'UPDATE asistencias SET hora_salida = ? WHERE id = ?',
                [now, sessionId]
            );

            return {
                success: true,
                message: `¡Hasta luego, ${emp.nombres}! Salida registrada.`,
                empleado: nombreCompleto,
                tipo: 'salida',
                hora: now.toLocaleTimeString()
            };

        } else {
            // === ENTRADA (CHECK-IN) ===

            // REGLA: Bloqueo de Días No Laborables (Finde / Feriado)
            if (isNonWorkingDay && emp.permite_horas_extras !== 1) {
                const reason = isHoliday ? `Feriado (${holidayName})` : 'Fin de Semana';
                const msg = `Día no laborable: ${reason}.`;
                await logFailure(empleadoId, 'entrada', msg);
                return { success: false, message: msg };
            }

            const [closedSessions] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM asistencias WHERE empleado_id = ? AND fecha = ? AND hora_salida IS NOT NULL',
                [empleadoId, today]
            );

            // Si ya cerró turno y vuelve a abrir -> es Hora Extra
            const esHoraExtra = closedSessions.length > 0;

            if (esHoraExtra && emp.permite_horas_extras !== 1) {
                // Si intenta reingresar pero no tiene permiso -> Bloqueo opcional? 
                // El user pidió bloquear "si marca fuera del horario... no cumple con horas extras".
                // Asumimos que reingreso post-turno cuenta como "fuera de horario".
                const msg = 'Turno finalizado. No tienes extras autorizadas.';
                await logFailure(empleadoId, 'entrada', msg);
                return { success: false, message: msg };
            }

            let estadoAsistencia = esHoraExtra ? 'horas_extras' : 'puntual';

            // Lógica de Estados: Puntual vs Tarde vs Ausente
            if (!esHoraExtra && emp.hora_entrada) {
                const turnoEntrada = getDateFromTime(emp.hora_entrada);
                const toleranciaMin = emp.margen_tolerancia_minutos || 15;

                // Límites
                const limitePuntual = new Date(turnoEntrada.getTime() + toleranciaMin * 60000);
                const limiteTarde = new Date(limitePuntual.getTime() + 60 * 60000); // 60 min después de tolerancia

                if (now <= limitePuntual) {
                    estadoAsistencia = 'puntual';
                } else if (now <= limiteTarde) {
                    estadoAsistencia = 'tarde';
                } else {
                    // Pasó más de 60 min de la tolerancia -> Falta (Ausente) pero se registra ingreso
                    estadoAsistencia = 'ausente';
                }
            }

            await connection.execute(
                'INSERT INTO asistencias (empleado_id, fecha, hora_entrada, estado_asistencia, es_hora_extra) VALUES (?, ?, ?, ?, ?)',
                [empleadoId, today, now, estadoAsistencia, esHoraExtra]
            );

            const msg = esHoraExtra
                ? `¡Hola de nuevo! Iniciando Horas Extras.`
                : `¡Bienvenido, ${emp.nombres}! Entrada registrada.`;

            return {
                success: true,
                message: msg,
                empleado: nombreCompleto,
                tipo: 'entrada',
                hora: now.toLocaleTimeString()
            };
        }

    } catch (error: any) {
        console.error('Error registrando asistencia:', error);
        return { success: false, message: error.message || 'Error interno.' };
    } finally {
        if (connection) connection.release();
    }
}
