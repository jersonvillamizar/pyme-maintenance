# Especificación de Requisitos de Software (SRS)
## Sistema de Gestión de Mantenimiento para PYMES - MantenPro

**Documento IEEE 830-1998**

---

## Información del Documento

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0 |
| **Fecha** | Enero 2026 |
| **Estado** | Aprobado |
| **Proyecto** | MantenPro - Sistema de Gestión de Mantenimiento |

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
   - 1.1 Propósito
   - 1.2 Alcance
   - 1.3 Definiciones, Acrónimos y Abreviaturas
   - 1.4 Referencias
   - 1.5 Visión General del Documento
2. [Descripción General](#2-descripción-general)
   - 2.1 Perspectiva del Producto
   - 2.2 Funciones del Producto
   - 2.3 Características de los Usuarios
   - 2.4 Restricciones
   - 2.5 Suposiciones y Dependencias
3. [Requisitos Específicos](#3-requisitos-específicos)
   - 3.1 Requisitos Funcionales
   - 3.2 Requisitos No Funcionales
   - 3.3 Requisitos de Interfaz
   - 3.4 Requisitos de Base de Datos
4. [Apéndices](#4-apéndices)

---

## 1. Introducción

### 1.1 Propósito

El propósito de este documento es proporcionar una especificación completa y detallada de los requisitos del sistema **MantenPro**, un sistema de gestión de mantenimiento diseñado específicamente para pequeñas y medianas empresas (PYMES). Este documento está dirigido a:

- Equipo de desarrollo
- Stakeholders del proyecto
- Personal de QA y testing
- Administradores del sistema

### 1.2 Alcance

**MantenPro** es una aplicación web que permite a las PYMES gestionar de manera eficiente el mantenimiento de sus equipos e infraestructura. El sistema proporciona:

- Registro y seguimiento de equipos
- Programación de mantenimientos preventivos y correctivos
- Gestión de técnicos y asignación de tareas
- Dashboard con métricas e indicadores clave
- Sistema de alertas y notificaciones
- Generación de reportes en PDF y Excel
- Historial completo de intervenciones

**Beneficios esperados:**
- Reducción de tiempos de inactividad de equipos
- Mejora en la planificación de mantenimientos
- Trazabilidad completa de intervenciones
- Toma de decisiones basada en datos

### 1.3 Definiciones, Acrónimos y Abreviaturas

| Término | Definición |
|---------|------------|
| **PYME** | Pequeña y Mediana Empresa |
| **SRS** | Software Requirements Specification (Especificación de Requisitos de Software) |
| **CRUD** | Create, Read, Update, Delete (Crear, Leer, Actualizar, Eliminar) |
| **API** | Application Programming Interface |
| **UI** | User Interface (Interfaz de Usuario) |
| **UX** | User Experience (Experiencia de Usuario) |
| **JWT** | JSON Web Token |
| **ORM** | Object-Relational Mapping |
| **RBAC** | Role-Based Access Control (Control de Acceso Basado en Roles) |
| **Mantenimiento Preventivo** | Mantenimiento programado para prevenir fallas |
| **Mantenimiento Correctivo** | Mantenimiento realizado para corregir una falla existente |

### 1.4 Referencias

| Documento | Descripción |
|-----------|-------------|
| IEEE 830-1998 | Estándar IEEE para Especificación de Requisitos de Software |
| Next.js 15 Documentation | Framework de React utilizado |
| Prisma Documentation | ORM utilizado para la base de datos |
| PostgreSQL 16 Documentation | Sistema de gestión de base de datos |

### 1.5 Visión General del Documento

- **Sección 2** describe el contexto general del sistema, sus funciones principales y las características de los usuarios.
- **Sección 3** detalla los requisitos específicos funcionales y no funcionales.
- **Sección 4** contiene información adicional y apéndices.

---

## 2. Descripción General

### 2.1 Perspectiva del Producto

MantenPro es un sistema independiente que opera como una aplicación web moderna. Se integra con:

- **Base de datos PostgreSQL**: Almacenamiento persistente de datos
- **Sistema de autenticación**: NextAuth.js para gestión de sesiones
- **Servicios de exportación**: Generación de documentos PDF y Excel

#### 2.1.1 Diagrama de Contexto

```
┌─────────────────────────────────────────────────────────────┐
│                        MantenPro                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Frontend  │  │   Backend   │  │  Database   │         │
│  │  (Next.js)  │◄─┤  (API Rest) │◄─┤ (PostgreSQL)│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
        ▲                   ▲
        │                   │
   ┌────┴────┐         ┌────┴────┐
   │ Usuarios │         │ Reportes│
   │  (Web)   │         │PDF/Excel│
   └──────────┘         └─────────┘
```

### 2.2 Funciones del Producto

#### 2.2.1 Gestión de Equipos
- Registro completo de equipos (tipo, marca, modelo, serial, ubicación)
- Estados de equipo: Activo, Inactivo, En Mantenimiento, Dado de Baja
- Asociación de equipos a empresas cliente
- Historial de mantenimientos por equipo

#### 2.2.2 Gestión de Mantenimientos
- Programación de mantenimientos preventivos y correctivos
- Asignación de técnicos responsables
- Seguimiento de estados: Programado, En Proceso, Completado, Cancelado
- Registro de observaciones y reportes técnicos
- Adjuntar documentos y reportes

#### 2.2.3 Dashboard y Métricas
- Total de equipos y estado general
- Mantenimientos pendientes y completados
- Tiempo promedio de resolución
- Fallas recurrentes por equipo
- Gráficos de tendencias mensuales
- Equipos críticos que requieren atención

#### 2.2.4 Sistema de Alertas
- Alertas por mantenimientos próximos a vencer
- Notificaciones de equipos críticos
- Gestión de prioridades (Alta, Media, Baja)

#### 2.2.5 Reportes y Exportación
- Exportación de datos a Excel (.xlsx)
- Generación de reportes en PDF
- Reportes de equipos, mantenimientos e historial

#### 2.2.6 Gestión de Usuarios y Empresas
- Administración de usuarios con roles diferenciados
- Registro de empresas cliente
- Control de acceso basado en roles (RBAC)

### 2.3 Características de los Usuarios

#### 2.3.1 Administrador (ADMIN)
| Característica | Descripción |
|----------------|-------------|
| **Perfil** | Personal de TI o gerencia con conocimientos técnicos |
| **Responsabilidades** | Gestión completa del sistema, usuarios, empresas y configuración |
| **Nivel de acceso** | Acceso total a todas las funcionalidades |
| **Frecuencia de uso** | Diaria |

#### 2.3.2 Técnico (TECNICO)
| Característica | Descripción |
|----------------|-------------|
| **Perfil** | Personal técnico de mantenimiento |
| **Responsabilidades** | Ejecutar y documentar mantenimientos asignados |
| **Nivel de acceso** | Acceso a mantenimientos asignados y equipos relacionados |
| **Frecuencia de uso** | Diaria |

#### 2.3.3 Cliente (CLIENTE)
| Característica | Descripción |
|----------------|-------------|
| **Perfil** | Representante de empresa cliente |
| **Responsabilidades** | Visualizar estado de sus equipos y mantenimientos |
| **Nivel de acceso** | Solo lectura de equipos y mantenimientos de su empresa |
| **Frecuencia de uso** | Semanal |

### 2.4 Restricciones

#### 2.4.1 Restricciones Técnicas
- El sistema debe ejecutarse en navegadores modernos (Chrome, Firefox, Edge, Safari)
- Requiere conexión a Internet para su funcionamiento
- Base de datos PostgreSQL versión 14 o superior
- Node.js versión 18 o superior

#### 2.4.2 Restricciones de Seguridad
- Las contraseñas deben almacenarse con hash bcrypt
- Las sesiones deben expirar después de 24 horas de inactividad
- Todas las comunicaciones deben usar HTTPS en producción

#### 2.4.3 Restricciones de Negocio
- El sistema está diseñado para PYMES con hasta 1000 equipos
- Soporte para hasta 100 usuarios concurrentes

### 2.5 Suposiciones y Dependencias

#### Suposiciones
1. Los usuarios tienen acceso a un navegador web moderno
2. Los usuarios tienen conocimientos básicos de informática
3. Existe conectividad a Internet estable
4. Los datos de equipos serán ingresados de forma precisa

#### Dependencias
1. Disponibilidad de servidor PostgreSQL
2. Servicio de hosting para la aplicación Next.js
3. Certificado SSL para conexiones seguras

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales

#### RF-001: Autenticación de Usuarios
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-001 |
| **Nombre** | Autenticación de Usuarios |
| **Descripción** | El sistema debe permitir a los usuarios iniciar sesión con email y contraseña |
| **Prioridad** | Alta |
| **Entrada** | Email, contraseña |
| **Proceso** | Validar credenciales contra la base de datos |
| **Salida** | Sesión iniciada o mensaje de error |
| **Precondición** | Usuario registrado en el sistema |
| **Postcondición** | Usuario autenticado con acceso según su rol |

#### RF-002: Gestión de Equipos - Crear
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-002 |
| **Nombre** | Crear Equipo |
| **Descripción** | El sistema debe permitir registrar nuevos equipos |
| **Prioridad** | Alta |
| **Entrada** | Tipo, marca, modelo, serial, estado, ubicación, empresa |
| **Proceso** | Validar datos y almacenar en base de datos |
| **Salida** | Equipo creado con ID único |
| **Precondición** | Usuario con rol ADMIN autenticado |
| **Postcondición** | Equipo registrado y visible en el listado |

#### RF-003: Gestión de Equipos - Listar
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-003 |
| **Nombre** | Listar Equipos |
| **Descripción** | El sistema debe mostrar la lista de equipos con filtros |
| **Prioridad** | Alta |
| **Entrada** | Filtros opcionales (estado, empresa, búsqueda) |
| **Proceso** | Consultar base de datos con filtros aplicados |
| **Salida** | Lista paginada de equipos |
| **Precondición** | Usuario autenticado |
| **Postcondición** | Equipos mostrados según permisos del rol |

#### RF-004: Gestión de Equipos - Actualizar
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-004 |
| **Nombre** | Actualizar Equipo |
| **Descripción** | El sistema debe permitir modificar datos de equipos existentes |
| **Prioridad** | Alta |
| **Entrada** | ID del equipo, datos a modificar |
| **Proceso** | Validar permisos y actualizar registro |
| **Salida** | Equipo actualizado |
| **Precondición** | Usuario ADMIN autenticado, equipo existente |
| **Postcondición** | Datos del equipo actualizados |

#### RF-005: Gestión de Equipos - Eliminar
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-005 |
| **Nombre** | Eliminar Equipo |
| **Descripción** | El sistema debe permitir eliminar equipos |
| **Prioridad** | Media |
| **Entrada** | ID del equipo |
| **Proceso** | Validar permisos y eliminar registro (cascade) |
| **Salida** | Confirmación de eliminación |
| **Precondición** | Usuario ADMIN autenticado, equipo existente |
| **Postcondición** | Equipo y registros relacionados eliminados |

#### RF-006: Gestión de Mantenimientos - Crear
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-006 |
| **Nombre** | Crear Mantenimiento |
| **Descripción** | El sistema debe permitir programar nuevos mantenimientos |
| **Prioridad** | Alta |
| **Entrada** | Equipo, técnico, tipo, fecha programada, descripción |
| **Proceso** | Validar datos, crear registro y generar alerta |
| **Salida** | Mantenimiento creado |
| **Precondición** | Usuario ADMIN autenticado |
| **Postcondición** | Mantenimiento programado, alerta generada |

#### RF-007: Gestión de Mantenimientos - Actualizar Estado
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-007 |
| **Nombre** | Actualizar Estado de Mantenimiento |
| **Descripción** | El sistema debe permitir cambiar el estado de un mantenimiento |
| **Prioridad** | Alta |
| **Entrada** | ID mantenimiento, nuevo estado, observaciones |
| **Proceso** | Validar transición de estado, actualizar registro |
| **Salida** | Mantenimiento actualizado |
| **Precondición** | Usuario ADMIN o TECNICO asignado |
| **Postcondición** | Estado actualizado, historial registrado |

#### RF-008: Dashboard - Visualizar Métricas
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-008 |
| **Nombre** | Visualizar Dashboard |
| **Descripción** | El sistema debe mostrar métricas y KPIs en tiempo real |
| **Prioridad** | Alta |
| **Entrada** | Ninguna (datos de sesión) |
| **Proceso** | Calcular métricas según rol del usuario |
| **Salida** | Dashboard con métricas |
| **Precondición** | Usuario autenticado |
| **Postcondición** | Métricas mostradas según permisos |

**Métricas incluidas:**
- Total de equipos
- Mantenimientos pendientes
- Completados este mes
- Equipos críticos
- Tiempo promedio de resolución
- Fallas recurrentes por equipo
- Gráfico de mantenimientos por mes

#### RF-009: Exportar Reportes
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-009 |
| **Nombre** | Exportar Reportes |
| **Descripción** | El sistema debe permitir exportar datos a PDF y Excel |
| **Prioridad** | Alta |
| **Entrada** | Tipo de reporte, filtros |
| **Proceso** | Generar documento con datos filtrados |
| **Salida** | Archivo PDF o Excel descargable |
| **Precondición** | Usuario autenticado con datos disponibles |
| **Postcondición** | Archivo generado y descargado |

#### RF-010: Gestión de Alertas
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-010 |
| **Nombre** | Gestión de Alertas |
| **Descripción** | El sistema debe generar y mostrar alertas de mantenimientos |
| **Prioridad** | Alta |
| **Entrada** | Automático basado en fechas programadas |
| **Proceso** | Evaluar proximidad de fechas, generar alertas |
| **Salida** | Lista de alertas con prioridad |
| **Precondición** | Mantenimientos programados en el sistema |
| **Postcondición** | Alertas visibles en el sistema |

#### RF-011: Historial de Intervenciones
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-011 |
| **Nombre** | Consultar Historial |
| **Descripción** | El sistema debe mostrar el historial completo de intervenciones |
| **Prioridad** | Alta |
| **Entrada** | Filtros (equipo, técnico, fecha, empresa) |
| **Proceso** | Consultar registros de historial con filtros |
| **Salida** | Lista de intervenciones ordenada por fecha |
| **Precondición** | Usuario autenticado |
| **Postcondición** | Historial mostrado según permisos del rol |

#### RF-012: Gestión de Usuarios
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-012 |
| **Nombre** | Gestión de Usuarios |
| **Descripción** | El sistema debe permitir administrar usuarios |
| **Prioridad** | Alta |
| **Entrada** | Datos del usuario (nombre, email, rol, empresa) |
| **Proceso** | CRUD de usuarios con validación de permisos |
| **Salida** | Usuario creado/modificado/eliminado |
| **Precondición** | Usuario ADMIN autenticado |
| **Postcondición** | Usuario gestionado correctamente |

#### RF-013: Gestión de Empresas
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-013 |
| **Nombre** | Gestión de Empresas |
| **Descripción** | El sistema debe permitir administrar empresas cliente |
| **Prioridad** | Alta |
| **Entrada** | Datos de empresa (nombre, NIT, contacto, etc.) |
| **Proceso** | CRUD de empresas |
| **Salida** | Empresa creada/modificada/eliminada |
| **Precondición** | Usuario ADMIN autenticado |
| **Postcondición** | Empresa gestionada correctamente |

### 3.2 Requisitos No Funcionales

#### RNF-001: Rendimiento
| Campo | Descripción |
|-------|-------------|
| **ID** | RNF-001 |
| **Nombre** | Tiempo de Respuesta |
| **Descripción** | El sistema debe responder en menos de 200ms para operaciones estándar |
| **Métrica** | Latencia de API < 200ms (p95) |
| **Prioridad** | Alta |

#### RNF-002: Disponibilidad
| Campo | Descripción |
|-------|-------------|
| **ID** | RNF-002 |
| **Nombre** | Disponibilidad del Sistema |
| **Descripción** | El sistema debe estar disponible el 99.5% del tiempo |
| **Métrica** | Uptime >= 99.5% mensual |
| **Prioridad** | Alta |

#### RNF-003: Seguridad - Autenticación
| Campo | Descripción |
|-------|-------------|
| **ID** | RNF-003 |
| **Nombre** | Seguridad de Autenticación |
| **Descripción** | Las contraseñas deben almacenarse con hash bcrypt |
| **Métrica** | 100% de contraseñas hasheadas |
| **Prioridad** | Alta |

#### RNF-004: Seguridad - Autorización
| Campo | Descripción |
|-------|-------------|
| **ID** | RNF-004 |
| **Nombre** | Control de Acceso |
| **Descripción** | El sistema debe implementar RBAC para control de acceso |
| **Métrica** | 100% de endpoints protegidos |
| **Prioridad** | Alta |

#### RNF-005: Usabilidad
| Campo | Descripción |
|-------|-------------|
| **ID** | RNF-005 |
| **Nombre** | Facilidad de Uso |
| **Descripción** | La interfaz debe ser intuitiva y responsive |
| **Métrica** | Diseño adaptable a móvil, tablet y desktop |
| **Prioridad** | Media |

#### RNF-006: Mantenibilidad
| Campo | Descripción |
|-------|-------------|
| **ID** | RNF-006 |
| **Nombre** | Código Mantenible |
| **Descripción** | El código debe seguir estándares y buenas prácticas |
| **Métrica** | Cobertura de tests > 80% |
| **Prioridad** | Media |

#### RNF-007: Escalabilidad
| Campo | Descripción |
|-------|-------------|
| **ID** | RNF-007 |
| **Nombre** | Escalabilidad |
| **Descripción** | El sistema debe soportar crecimiento de usuarios y datos |
| **Métrica** | Soporte para 100 usuarios concurrentes, 1000 equipos |
| **Prioridad** | Media |

### 3.3 Requisitos de Interfaz

#### 3.3.1 Interfaz de Usuario

| Componente | Descripción |
|------------|-------------|
| **Sidebar** | Navegación principal con acceso a todos los módulos |
| **Header** | Información del usuario, notificaciones, logout |
| **Dashboard** | Tarjetas de métricas, gráficos, tablas de resumen |
| **Formularios** | Validación en tiempo real, mensajes de error claros |
| **Tablas** | Paginación, búsqueda, filtros, ordenamiento |
| **Modales** | Confirmaciones, formularios de edición |

#### 3.3.2 Interfaz de API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/*` | POST | Autenticación (NextAuth) |
| `/api/equipos` | GET, POST | Listar y crear equipos |
| `/api/equipos/[id]` | GET, PUT, DELETE | Operaciones por equipo |
| `/api/mantenimientos` | GET, POST | Listar y crear mantenimientos |
| `/api/mantenimientos/[id]` | GET, PUT, DELETE | Operaciones por mantenimiento |
| `/api/usuarios` | GET, POST | Listar y crear usuarios |
| `/api/usuarios/[id]` | GET, PUT, DELETE | Operaciones por usuario |
| `/api/empresas` | GET, POST | Listar y crear empresas |
| `/api/empresas/[id]` | GET, PUT, DELETE | Operaciones por empresa |
| `/api/alertas` | GET, POST | Gestión de alertas |
| `/api/historial` | GET | Consulta de historial |
| `/api/dashboard/stats` | GET | Métricas del dashboard |

### 3.4 Requisitos de Base de Datos

#### 3.4.1 Modelo de Datos

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Empresa   │────<│   Equipo    │────<│Mantenimiento│
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │  Historial  │     │   Alerta    │
└─────────────┘     └─────────────┘     └─────────────┘
```

#### 3.4.2 Entidades Principales

**Empresa**
- id (PK)
- nombre
- nit (unique)
- contacto
- telefono
- email
- direccion
- createdAt
- updatedAt

**User**
- id (PK)
- email (unique)
- password (hash)
- nombre
- role (ADMIN, TECNICO, CLIENTE)
- empresaId (FK, opcional)
- activo
- createdAt
- updatedAt

**Equipo**
- id (PK)
- tipo
- marca
- modelo
- serial (unique)
- estado (ACTIVO, INACTIVO, EN_MANTENIMIENTO, DADO_DE_BAJA)
- ubicacion
- empresaId (FK)
- createdAt
- updatedAt

**Mantenimiento**
- id (PK)
- equipoId (FK)
- tecnicoId (FK)
- tipo (PREVENTIVO, CORRECTIVO)
- estado (PROGRAMADO, EN_PROCESO, COMPLETADO, CANCELADO)
- fechaProgramada
- fechaRealizada
- descripcion
- observaciones
- reporteUrl
- createdAt
- updatedAt

**Historial**
- id (PK)
- equipoId (FK)
- mantenimientoId (FK, opcional)
- tecnicoId (FK)
- fecha
- observaciones

**Alerta**
- id (PK)
- mantenimientoId (FK)
- tipo
- mensaje
- prioridad
- enviada
- fechaEnvio
- createdAt

---

## 4. Apéndices

### 4.1 Matriz de Trazabilidad

| Requisito | Módulo | Archivo Principal | Estado |
|-----------|--------|-------------------|--------|
| RF-001 | Auth | src/lib/auth.ts | Implementado |
| RF-002 | Equipos | src/app/api/equipos/route.ts | Implementado |
| RF-003 | Equipos | src/app/(dashboard)/equipos/page.tsx | Implementado |
| RF-004 | Equipos | src/app/api/equipos/[id]/route.ts | Implementado |
| RF-005 | Equipos | src/app/api/equipos/[id]/route.ts | Implementado |
| RF-006 | Mantenimientos | src/app/api/mantenimientos/route.ts | Implementado |
| RF-007 | Mantenimientos | src/app/api/mantenimientos/[id]/route.ts | Implementado |
| RF-008 | Dashboard | src/app/(dashboard)/page.tsx | Implementado |
| RF-009 | Reportes | src/lib/excel-export.ts, src/lib/pdf-export.ts | Implementado |
| RF-010 | Alertas | src/app/api/alertas/route.ts | Implementado |
| RF-011 | Historial | src/app/(dashboard)/historial/page.tsx | Implementado |
| RF-012 | Usuarios | src/app/(dashboard)/usuarios/page.tsx | Implementado |
| RF-013 | Empresas | src/app/(dashboard)/empresas/page.tsx | Implementado |

### 4.2 Tecnologías Utilizadas

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework Frontend | Next.js | 15.x |
| Framework UI | React | 19.x |
| Estilos | Tailwind CSS | 4.x |
| Componentes UI | shadcn/ui | Latest |
| ORM | Prisma | 6.x |
| Base de Datos | PostgreSQL | 16.x |
| Autenticación | NextAuth.js | 4.x |
| Validación | Zod | 3.x |
| Exportación Excel | xlsx | 0.18.x |
| Exportación PDF | jspdf + jspdf-autotable | 2.x |
| Lenguaje | TypeScript | 5.x |

### 4.3 Estructura del Proyecto

```
pyme-maintenance/
├── prisma/
│   └── schema.prisma          # Modelo de datos
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Páginas protegidas
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── equipos/       # Gestión de equipos
│   │   │   ├── mantenimientos/# Gestión de mantenimientos
│   │   │   ├── usuarios/      # Gestión de usuarios
│   │   │   ├── empresas/      # Gestión de empresas
│   │   │   ├── alertas/       # Sistema de alertas
│   │   │   └── historial/     # Historial de intervenciones
│   │   ├── api/               # Endpoints API
│   │   └── login/             # Página de login
│   ├── components/            # Componentes reutilizables
│   ├── lib/                   # Utilidades y configuración
│   └── types/                 # Definiciones de tipos
├── docs/                      # Documentación
└── scripts/                   # Scripts de utilidad
```

### 4.4 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@mantenpro.com | password123 |
| Técnico | tecnico1@mantenpro.com | password123 |
| Cliente | cliente1@techsolutions.com | password123 |

---

## Control de Cambios

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0 | Enero 2026 | Equipo de Desarrollo | Versión inicial del documento |

---

*Documento generado siguiendo el estándar IEEE 830-1998 para Especificación de Requisitos de Software.*
