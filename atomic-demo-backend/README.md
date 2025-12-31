# Demo de Arquitectura Atómica (Backend)

Esta aplicación de demostración implementa un backend en Node.js siguiendo estrictamente los principios de diseño atómico.

## Estructura del Proyecto

La estructura de carpetas refleja la jerarquía atómica:

```
src/
├── core/
│   ├── atoms/          # Entidades y DTOs (Indivisibles)
│   │   ├── User.entity.ts
│   │   └── UserDTOs.ts
│   └── molecules/      # Repositorios (Combinación simple)
│       └── UserRepository.ts
├── domain/
│   └── organisms/      # Casos de Uso (Lógica de Negocio)
│       └── RegisterUserUseCase.ts
└── infrastructure/
    ├── controllers/    # Plantillas/Páginas (Entrada/Salida)
    │   └── UserController.ts
    └── database/
        └── data-source.ts
```

## Ejecución

El servicio está corriendo en el puerto `3001` gestionado por PM2 (`atomic-demo`).

### Probar el Endpoint

Puedes registrar un usuario usando `curl` desde el servidor:

```bash
curl -X POST http://localhost:3001/users/register \
-H "Content-Type: application/json" \
-d '{"name": "Nuevo Usuario", "email": "usuario@ejemplo.com"}'
```

Revisar logs:
`pm2 logs atomic-demo`
