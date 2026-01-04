# Guía de Desarrollo

## Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en http://localhost:3000
```

### Base de Datos (Docker)
```bash
# Iniciar contenedor PostgreSQL
docker start pyme-db

# Detener contenedor
docker stop pyme-db

# Ver logs
docker logs pyme-db

# Acceder a PostgreSQL
docker exec -it pyme-db psql -U postgres -d pyme_maintenance

# Ver tablas
docker exec -it pyme-db psql -U postgres -d pyme_maintenance -c "\dt"
```

### Prisma
```bash
# Generar cliente Prisma (después de cambios en schema)
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar cambios al schema sin migraciones
npx prisma db push

# Abrir Prisma Studio (GUI para ver/editar datos)
npx prisma studio

# Reset de base de datos (CUIDADO: borra todos los datos)
npx prisma migrate reset
```

### Git
```bash
# Ver cambios
git status

# Agregar cambios
git add .

# Commit
git commit -m "mensaje"

# Push
git push origin main

# Pull
git pull origin main
```

### Build y Deploy
```bash
# Build de producción
npm run build

# Iniciar en modo producción
npm start

# Linter
npm run lint
```

## Estructura de Carpetas

```
pyme-maintenance/
├── docs/                           # Documentación del proyecto
│   ├── resumen-ejecutivo.md
│   ├── diagrama-db.md
│   └── guia-desarrollo.md
├── prisma/
│   └── schema.prisma              # Schema de base de datos
├── public/                        # Archivos estáticos
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/          # Rutas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── equipos/
│   │   │   ├── mantenimientos/
│   │   │   └── reportes/
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   ├── equipos/
│   │   │   ├── mantenimientos/
│   │   │   └── reportes/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # Componentes React
│   │   ├── ui/                   # Componentes shadcn/ui
│   │   ├── forms/
│   │   ├── tables/
│   │   └── dashboard/
│   ├── lib/                      # Utilidades y configs
│   │   ├── prisma.ts            # Cliente Prisma
│   │   ├── auth.ts              # Configuración NextAuth
│   │   ├── validations.ts       # Schemas Zod
│   │   └── utils.ts
│   └── types/                    # TypeScript types
│       └── index.ts
├── .env                          # Variables de entorno (NO subir a Git)
├── .gitignore
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase (`UserForm.tsx`)
- **Archivos**: kebab-case (`user-form.tsx`)
- **Variables/funciones**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- **Tipos/Interfaces**: PascalCase (`UserData`, `ApiResponse`)

### Imports
```typescript
// 1. Librerías externas
import { useState } from 'react'
import { prisma } from '@/lib/prisma'

// 2. Componentes
import { Button } from '@/components/ui/button'

// 3. Utilidades
import { cn } from '@/lib/utils'

// 4. Tipos
import type { User } from '@/types'
```

### Componentes
```typescript
// Preferir function components
export default function ComponentName({ prop1, prop2 }: Props) {
  return <div>...</div>
}

// Exportar tipos junto al componente
interface Props {
  prop1: string
  prop2: number
}
```

## Validación con Zod

```typescript
import { z } from 'zod'

export const equipoSchema = z.object({
  tipo: z.string().min(1, "Tipo es requerido"),
  marca: z.string().min(1, "Marca es requerida"),
  serial: z.string().min(1, "Serial es requerido"),
  empresaId: z.string().cuid("ID de empresa inválido")
})

type EquipoInput = z.infer<typeof equipoSchema>
```

## Uso de Prisma Client

```typescript
import { prisma } from '@/lib/prisma'

// Crear
const equipo = await prisma.equipo.create({
  data: {
    tipo: "Laptop",
    marca: "Dell",
    serial: "ABC123",
    empresaId: "..."
  }
})

// Leer
const equipos = await prisma.equipo.findMany({
  where: { empresaId: "..." },
  include: {
    empresa: true,
    mantenimientos: true
  }
})

// Actualizar
const updated = await prisma.equipo.update({
  where: { id: "..." },
  data: { estado: "EN_MANTENIMIENTO" }
})

// Eliminar
await prisma.equipo.delete({
  where: { id: "..." }
})
```

## API Routes (Next.js)

```typescript
// app/api/equipos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const equipos = await prisma.equipo.findMany()
    return NextResponse.json(equipos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener equipos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const equipo = await prisma.equipo.create({ data: body })
    return NextResponse.json(equipo, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear equipo' },
      { status: 500 }
    )
  }
}
```

## Variables de Entorno

### Archivo `.env`
```bash
# Database
DATABASE_URL="postgresql://postgres:admin123@127.0.0.1:5432/pyme_maintenance?schema=public"

# NextAuth (agregar después)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (agregar después si se usa)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"
```

## Testing (Próximamente)

```bash
# Instalar Jest y React Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test

# Coverage
npm run test:coverage
```

## Seguridad

### Buenas Prácticas
- ✅ Nunca subir `.env` a Git
- ✅ Validar todos los inputs con Zod
- ✅ Sanitizar datos antes de queries SQL
- ✅ Usar prepared statements (Prisma lo hace automáticamente)
- ✅ Implementar rate limiting en API routes
- ✅ Hashear contraseñas con bcrypt
- ✅ Usar HTTPS en producción
- ✅ Implementar CSRF protection

### Evitar
- ❌ SQL injection (usar Prisma correctamente)
- ❌ XSS (React escapa automáticamente, pero cuidado con dangerouslySetInnerHTML)
- ❌ Exponer información sensible en errores
- ❌ Hardcodear credenciales

## Troubleshooting

### Prisma no conecta a DB
```bash
# Verificar que Docker esté corriendo
docker ps

# Verificar que el contenedor esté up
docker start pyme-db

# Regenerar cliente
npx prisma generate
```

### Error de tipos TypeScript
```bash
# Regenerar tipos de Prisma
npx prisma generate

# Reiniciar TypeScript server en VSCode
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Puerto 3000 en uso
```bash
# Windows: encontrar proceso
netstat -ano | findstr :3000

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F

# O usar otro puerto
npm run dev -- -p 3001
```

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [NextAuth.js](https://next-auth.js.org/)
