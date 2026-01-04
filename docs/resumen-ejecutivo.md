# Sistema de Gestión de Mantenimiento para PYMEs

## Resumen Ejecutivo

Sistema web para mejorar la gestión del mantenimiento preventivo y correctivo de equipos de cómputo en pequeñas y medianas empresas (PYMEs).

## Objetivo

Planificar, registrar, controlar y hacer seguimiento a los mantenimientos realizados en equipos informáticos, reduciendo fallos técnicos y mejorando la productividad operativa.

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de datos**: PostgreSQL (Docker)
- **Autenticación**: NextAuth.js
- **Validación**: Zod
- **Formularios**: React Hook Form

## Módulos Principales

### 1. Gestión de Usuarios y Roles
- **Roles**: Administrador, Técnico, Cliente PYME
- Control de acceso basado en roles
- Gestión de permisos

### 2. Módulo de Equipos
- Registro de equipos (tipo, marca, serial, estado)
- Ubicación física
- Historial completo de mantenimientos por equipo
- Estados: Activo, Inactivo, En Mantenimiento, Dado de Baja

### 3. Módulo de Mantenimientos
- Crear y asignar mantenimientos
- Clasificación: Preventivo o Correctivo
- Estados: Programado, En Proceso, Completado, Cancelado
- Adjuntar reportes PDF
- Fechas programadas y realizadas
- Asignación de responsables técnicos

### 4. Sistema de Alertas
- Notificaciones automáticas por mantenimientos programados
- Alertas por mantenimientos retrasados
- Sistema de notificaciones internas y correo electrónico

### 5. Dashboard de Seguimiento
- Métricas de fallas recurrentes
- Mantenimientos completados vs pendientes
- Equipos en estado crítico
- Tiempos promedio de resolución
- Gráficos y estadísticas

### 6. Gestión de Reportes
- Exportación a PDF y Excel
- Reportes de auditoría
- Control interno
- Historial de intervenciones por equipo
- Historial de intervenciones por técnico

## Requisitos No Funcionales

- Cumplimiento norma IEEE 830
- Interfaz responsive (móvil, tablet, desktop)
- Backend seguro y escalable
- Protección de datos (Art. 15 Constitución Colombiana)
- Latencia de respuesta < 200 ms
- Cobertura de pruebas > 80%

## Modelo de Base de Datos

### Tablas Principales

1. **empresas**: Datos de las PYMEs clientes
2. **users**: Usuarios del sistema (Admin, Técnico, Cliente)
3. **equipos**: Inventario de equipos de cómputo
4. **mantenimientos**: Registro de mantenimientos programados y realizados
5. **historial**: Log completo de todas las intervenciones
6. **alertas**: Sistema de notificaciones

### Relaciones

- Empresas → Usuarios (1:N)
- Empresas → Equipos (1:N)
- Equipos → Mantenimientos (1:N)
- Técnicos → Mantenimientos (1:N)
- Mantenimientos → Historial (1:N)
- Mantenimientos → Alertas (1:N)

## Flujo de Trabajo Típico

1. **Cliente PYME** registra equipos en el sistema
2. **Sistema** genera mantenimientos preventivos automáticos según calendario
3. **Administrador** asigna mantenimientos a técnicos
4. **Sistema** envía alertas a técnicos asignados
5. **Técnico** realiza el mantenimiento y registra observaciones
6. **Técnico** adjunta reporte PDF
7. **Sistema** actualiza historial del equipo
8. **Dashboard** muestra métricas actualizadas
9. **Administrador** genera reportes para auditoría

## Próximos Pasos de Desarrollo

1. Configurar NextAuth para autenticación
2. Instalar shadcn/ui para componentes UI
3. Crear layout principal y navegación
4. Implementar módulo de autenticación (login/registro)
5. Desarrollar CRUD de empresas
6. Desarrollar CRUD de equipos
7. Desarrollar CRUD de mantenimientos
8. Implementar dashboard con métricas
9. Desarrollar sistema de alertas
10. Implementar exportación de reportes
11. Pruebas unitarias e integración
12. Documentación técnica
