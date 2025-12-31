'use server';

import pool from '@/lib/db_asistencia';
import { RowDataPacket } from 'mysql2';

export interface DailyDetail {
    date: string;
    actualStart: string | null;
    actualEnd: string | null;
    status: string;
    hoursWorked: number;
}

export interface ReportSummary {
    employeeId: number;
    dni: string;
    fullName: string;
    daysPresent: number;
    latenessCount: number;
    totalLateMinutes: number;
    absences: number;
    totalHoursWorked: number;
    details: DailyDetail[];
}

export async function getMonthlyReport(month: number, year: number): Promise<ReportSummary[]> {
    try {
        // Construct date range for SQL
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;

        // Query: Fetch all active employees and their attendance records for the month
        // We join 'turnos' to calculate lateness against the scheduled start time
        // We use LAST_DAY(?) to get the end of the month dynamically
        const query = `
      SELECT 
        e.id as employeeId, 
        e.dni, 
        e.nombres, 
        e.apellidos,
        t.hora_entrada as scheduledStart,
        a.fecha, 
        a.hora_entrada as actualStart, 
        a.hora_salida as actualEnd,
        a.estado_asistencia
      FROM empleados e
      LEFT JOIN turnos t ON e.turno_id = t.id
      LEFT JOIN asistencias a ON e.id = a.empleado_id 
        AND a.fecha >= ? AND a.fecha <= LAST_DAY(?)
      WHERE e.estado = 'activo'
      ORDER BY e.apellidos, e.nombres, a.fecha
    `;

        const [rows] = await pool.query<RowDataPacket[]>(query, [startDate, startDate]);

        // Aggregate data in memory
        const map = new Map<number, ReportSummary>();

        for (const row of rows) {
            if (!map.has(row.employeeId)) {
                map.set(row.employeeId, {
                    employeeId: row.employeeId,
                    dni: row.dni,
                    fullName: `${row.nombres} ${row.apellidos}`,
                    daysPresent: 0,
                    latenessCount: 0,
                    totalLateMinutes: 0,
                    absences: 0,
                    totalHoursWorked: 0,
                    details: []
                });
            }

            const summary = map.get(row.employeeId)!;

            if (row.fecha) { // If there is an attendance record
                let dailyHours = 0;

                if (row.estado_asistencia === 'ausente') {
                    summary.absences += 1;
                } else {
                    // Assuming 'puntual', 'tarde', 'horas_extras' count as present
                    summary.daysPresent += 1;

                    if (row.estado_asistencia === 'tarde') {
                        summary.latenessCount += 1;
                        // Calculate late minutes if both times are available
                        if (row.actualStart && row.scheduledStart) {
                            // Parse times (assuming HH:mm:ss string or Date object)
                            // MySQL TIME type usually returns string 'HH:mm:ss'
                            // MySQL DATETIME returns Date object

                            const actual = new Date(row.actualStart);
                            // scheduledStart is TIME relative to day, actualStart is DATETIME
                            // We need to construct a Date for scheduledStart on the same day as actual
                            const [sHour, sMin, sSec] = row.scheduledStart.split(':').map(Number);
                            const scheduled = new Date(actual);
                            scheduled.setHours(sHour, sMin, sSec, 0);

                            if (actual > scheduled) {
                                const diffMs = actual.getTime() - scheduled.getTime();
                                summary.totalLateMinutes += Math.floor(diffMs / 60000);
                            }
                        }
                    }

                    // Calculate hours worked
                    if (row.actualStart && row.actualEnd) {
                        const start = new Date(row.actualStart);
                        const end = new Date(row.actualEnd);
                        const diffMs = end.getTime() - start.getTime();
                        const hours = diffMs / (1000 * 60 * 60);
                        if (hours > 0) {
                            summary.totalHoursWorked += hours;
                            dailyHours = hours;
                        }
                    }
                }

                // Add detail
                summary.details.push({
                    date: row.fecha instanceof Date ? row.fecha.toISOString().split('T')[0] : row.fecha,
                    actualStart: row.actualStart ? new Date(row.actualStart).toLocaleTimeString() : null,
                    actualEnd: row.actualEnd ? new Date(row.actualEnd).toLocaleTimeString() : null,
                    status: row.estado_asistencia,
                    hoursWorked: parseFloat(dailyHours.toFixed(2))
                });
            }
        }

        // Convert map to array and format numbers
        return Array.from(map.values()).map(item => ({
            ...item,
            totalHoursWorked: parseFloat(item.totalHoursWorked.toFixed(2))
        }));

    } catch (error) {
        console.error('Error generating monthly report:', error);
        throw new Error('Failed to generate report');
    }
}
