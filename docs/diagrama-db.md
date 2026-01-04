# Diagrama de Base de Datos

## Esquema Visual

```
┌─────────────────┐
│    EMPRESAS     │
├─────────────────┤
│ id (PK)         │
│ nombre          │
│ nit (UNIQUE)    │
│ contacto        │
│ telefono        │
│ email           │
│ direccion       │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
        │
        │ 1:N
        ├──────────────────┐
        │                  │
        ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│      USERS      │  │     EQUIPOS     │
├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │
│ email (UNIQUE)  │  │ tipo            │
│ password        │  │ marca           │
│ nombre          │  │ modelo          │
│ role (ENUM)     │  │ serial (UNIQUE) │
│ empresaId (FK)  │  │ estado (ENUM)   │
│ activo          │  │ ubicacion       │
│ createdAt       │  │ empresaId (FK)  │
│ updatedAt       │  │ createdAt       │
└─────────────────┘  │ updatedAt       │
        │            └─────────────────┘
        │                    │
        │                    │ 1:N
        │                    ▼
        │            ┌─────────────────────┐
        │            │  MANTENIMIENTOS     │
        │            ├─────────────────────┤
        │            │ id (PK)             │
        │ 1:N        │ equipoId (FK)       │
        └──────────► │ tecnicoId (FK)      │
                     │ tipo (ENUM)         │
                     │ estado (ENUM)       │
                     │ fechaProgramada     │
                     │ fechaRealizada      │
                     │ descripcion         │
                     │ observaciones       │
                     │ reporteUrl          │
                     │ createdAt           │
                     │ updatedAt           │
                     └─────────────────────┘
                             │
                             ├───────────────┐
                             │               │
                             │ 1:N           │ 1:N
                             ▼               ▼
                     ┌─────────────────┐  ┌─────────────────┐
                     │   HISTORIAL     │  │     ALERTAS     │
                     ├─────────────────┤  ├─────────────────┤
                     │ id (PK)         │  │ id (PK)         │
                     │ equipoId (FK)   │  │ mantenimientoId │
                     │ mantenimientoId │  │ tipo            │
                     │ tecnicoId (FK)  │  │ mensaje         │
                     │ fecha           │  │ enviada         │
                     │ observaciones   │  │ fechaEnvio      │
                     └─────────────────┘  │ createdAt       │
                                          └─────────────────┘
```

## Enumeraciones (ENUMs)

### Role
- `ADMIN`: Administrador del sistema
- `TECNICO`: Técnico de mantenimiento
- `CLIENTE`: Cliente de la PYME

### EstadoEquipo
- `ACTIVO`: Equipo operativo
- `INACTIVO`: Equipo temporalmente fuera de servicio
- `EN_MANTENIMIENTO`: Equipo en proceso de mantenimiento
- `DADO_DE_BAJA`: Equipo retirado permanentemente

### TipoMantenimiento
- `PREVENTIVO`: Mantenimiento programado preventivo
- `CORRECTIVO`: Mantenimiento por falla o problema

### EstadoMantenimiento
- `PROGRAMADO`: Mantenimiento agendado
- `EN_PROCESO`: Mantenimiento en ejecución
- `COMPLETADO`: Mantenimiento finalizado
- `CANCELADO`: Mantenimiento cancelado

## Relaciones Detalladas

### EMPRESAS → USERS (1:N)
- Una empresa puede tener múltiples usuarios
- Usuario puede pertenecer a una sola empresa (o ninguna si es Admin global)
- Relación opcional (empresaId nullable para admins)

### EMPRESAS → EQUIPOS (1:N)
- Una empresa puede tener múltiples equipos
- Cada equipo pertenece a una sola empresa
- Cascada: si se elimina empresa, se eliminan sus equipos

### EQUIPOS → MANTENIMIENTOS (1:N)
- Un equipo puede tener múltiples mantenimientos
- Cada mantenimiento se realiza sobre un solo equipo
- Cascada: si se elimina equipo, se eliminan sus mantenimientos

### USERS (Técnico) → MANTENIMIENTOS (1:N)
- Un técnico puede realizar múltiples mantenimientos
- Cada mantenimiento es realizado por un solo técnico
- Relación nombrada "TecnicoMantenimientos"

### MANTENIMIENTOS → HISTORIAL (1:N)
- Un mantenimiento puede tener múltiples entradas de historial
- Cada entrada de historial pertenece a un mantenimiento
- Set Null: si se elimina mantenimiento, historial mantiene referencia nula

### EQUIPOS → HISTORIAL (1:N)
- Un equipo tiene un historial completo de intervenciones
- Cascada: si se elimina equipo, se elimina su historial

### MANTENIMIENTOS → ALERTAS (1:N)
- Un mantenimiento puede generar múltiples alertas
- Cada alerta pertenece a un mantenimiento
- Cascada: si se elimina mantenimiento, se eliminan sus alertas

## Índices y Constraints

### Claves Primarias
Todas las tablas usan `id` de tipo TEXT (CUID) como PK

### Claves Únicas
- `empresas.nit`: NIT único por empresa
- `users.email`: Email único por usuario
- `equipos.serial`: Serial único por equipo

### Claves Foráneas con Cascada
- `equipos.empresaId` → ON DELETE CASCADE
- `mantenimientos.equipoId` → ON DELETE CASCADE
- `historial.equipoId` → ON DELETE CASCADE
- `historial.mantenimientoId` → ON DELETE SET NULL
- `alertas.mantenimientoId` → ON DELETE CASCADE

## Campos Comunes

### Timestamps
- `createdAt`: Fecha de creación (auto-generado)
- `updatedAt`: Fecha de última actualización (auto-actualizado)

### IDs
- Todos los IDs usan CUID (Collision-resistant Unique Identifier)
- Formato: `cxxxxxxxxxxxxxxxxxxxxxxxx`
