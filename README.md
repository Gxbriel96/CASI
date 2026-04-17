# CASI - Sistema de Gestión de Cooperativa Agrícola San Isabel

Sistema de gestión integral para la Cooperativa Agrícola San Isabel con módulos de gestión de socios, parcelas, cosechas, almacén, control de calidad y liquidaciones.

## Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Modelo de Datos](#modelo-de-datos)
4. [API Endpoints](#api-endpoints)
5. [Setup e Instalación](#setup-e-instalación)
6. [Decisiones Técnicas](#decisiones-técnicas)
7. [Testing](#testing)
8. [Documentación Adicional](#documentación-adicional)

---

## Arquitectura del Sistema

### Clean Architecture

El sistema sigue **Clean Architecture** para garantizar escalabilidad y mantenibilidad:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages    │  │ Components  │  │   TanStack Query    │ │
│  │  - Login   │  │  - UI/      │  │   Hooks (useQuery)   │ │
│  │  - Dashboard│ │  - Layout  │  │   - useSocios       │ │
│  │  - Socios  │  │  - Charts  │  │   - useEntradas    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API REST                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Controllers │──│  Services  │──│  Repositories      │ │
│  │ (HTTP)      │  │ (Lógica)   │  │  (Prisma)          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS                            │
│                   PostgreSQL                              │
│  ┌─────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐       │
│  │ Socios  │ │Parcelas│ │Cosechas │ │Silos    │       │
│  │ Entradas│ │Liquid. │ │Campanas │ │Frutas   │       │
│  └─────────┘ └────────┘ └─────────┘ └──────────┘       │
└──────────────────────���──────────────────────────────────────┘
```

### Por qué Clean Architecture

| Capa | Responsabilidad | Beneficio |
|------|-----------------|-----------|
| **Controllers** | HTTP requests/responses | Aislamiento del protocolo |
| **Services** | Lógica de negocio | Testabilidad sin HTTP |
| **Repositories** | Acceso a datos | Cambio de ORM sin afectar lógica |
| **Middleware** | Auth, validación, errores | Reutilización |

---

## Stack Tecnológico

### Backend

| Tecnología | Uso |
|-------------|-----|
| **Node.js 18+** | Runtime |
| **Express.js** | Framework API REST |
| **TypeScript** | Type safety |
| **Prisma** | ORM |
| **PostgreSQL** | Base de datos |
| **JWT** | Autenticación (access + refresh) |
| **Zod** | Validación de esquemas |
| **Helmet** | Seguridad HTTP |
| **Vitest** | Testing |

### Frontend

| Tecnología | Uso |
|-------------|-----|
| **React 18** | UI Framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Estilos |
| **shadcn/ui** | Componentes |
| **Recharts** | Gráficas |
| **TanStack Query** | Estado del servidor |
| **Axios** | Cliente HTTP |
| **Zod** | Validación formularios |
| **Playwright** | E2E Testing |

---

## Modelo de Datos

### Entidades Principales

```prisma
// Socios/Productores
Socio {
  id, numeroSocio, nombre, telefono, email, direccion
  → Parcelas[], Entradas[], Liquidaciones[], Frutas[]
}

// Parcelas (trazabilidad)
Parcela {
  id, socioId, nombre, hectareas, ubicacion, coordenadas
  → Cosechas[]
}

// Cosechas
Cosecha {
  id, parcelaId, cultivo, rendimiento, fechaSiembra, fechaCosecha
}

// Entradas de Almacén
EntradaAlmacen {
  id, socioId, cosechaId, siloId, peso, humedad
  pesoEspecifico, temperatura, impurezas
  → ControlCalidad[]
}

// Gestión de Silos
Silo {
  id, nombre, capacidad, stockActual, cultivo
}

// Liquidaciones
Liquidacion {
  id, socioId, cosechaId, totalKilos, precioBase
  importeBruto, apoyoGobierno, importeTotal
}
```

### Enums del Sistema

```prisma
Rol: ADMIN | EMPLEADO | SOCIO
TipoCultivo: MAIZ | TRIGO | CEBADA
EspecieFruta: MELOCOTON | NECTARINA | ALBARICOQUE | CIRUELA
Calibre: AA | A | B | C
ResultadoCalidad: APROBADO | RECHAZADO
```

---

## API Endpoints

### Autenticación

| Método | Ruta | Descripción | Autenticación |
|--------|------|--------------|---------------|
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/refresh` | Refresh token | No |
| GET | `/api/auth/me` | Usuario actual | Sí |
| POST | `/api/auth/register` | Registrar usuario | Admin |

### Socios/Productores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/socios?page=1&limit=10` | List paginado |
| GET | `/api/socios/:id` | Ver detalle |
| POST | `/api/socios` | Crear socio |
| PUT | `/api/socios/:id` | Actualizar |
| DELETE | `/api/socios/:id` | Eliminar |

### Parcelas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/socios/:id/parcelas` | Parcelas del socio |
| POST | `/api/socios/:id/parcelas` | Crear parcela |
| PUT | `/api/parcelas/:id` | Actualizar |
| DELETE | `/api/parcelas/:id` | Eliminar |

### Cosechas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cosechas` | Listar cosechas |
| POST | `/api/cosechas` | Registrar cosecha |
| PUT | `/api/cosechas/:id` | Actualizar |

### Almacén/Entradas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/entradas` | Listar entradas |
| POST | `/api/entradas` | Registrar entrada |
| PUT | `/api/entradas/:id` | Actualizar |
| DELETE | `/api/entradas/:id` | Eliminar |

### Control de Calidad

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/control-calidad` | Ver controles |
| POST | `/api/control-calidad` | Registrar análisis |
| PUT | `/api/control-calidad/:id/resultado` | Aprobar/Rechazar |

### Frutas (APPCC)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/frutas` | Listar controles |
| POST | `/api/frutas` | Registrar control |

### Liquidaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/liquidaciones` | Listar |
| POST | `/api/liquidaciones` | Crear manual |
| POST | `/api/liquidaciones/calcular` | Calcular automática |
| GET | `/api/liquidaciones/estadisticas` | Estadísticas |

### Dashboard

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard/metricas` | Métricas globales |
| GET | `/api/dashboard/silos` | Ocupación silos |
| GET | `/api/dashboard/top-socios` | Top liquidaciones |

### Campañas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/campanas/activa` | Campaña actual |
| POST | `/api/campanas` | Crear campaña |

---

## Setup e Instalación

### Requisitos Previos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env

# Editar .env con tus configuraciones
# DATABASE_URL, JWT_SECRET, etc.

# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Iniciar en desarrollo
npm run dev
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev
```

### Docker (Opcional)

```bash
# Iniciar toda la aplicación
docker compose up -d
```

### Variables de Entorno

#### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/casi"
JWT_SECRET=tu_secret_aqui_minimo_32_caracteres
JWT_REFRESH_SECRET=tu_refresh_secret_aqui
ALLOWED_ORIGINS=http://localhost:5173
```

---

## Decisiones Técnicas

### TypeScript

**Por qué TypeScript:**

1. **Seguridad en datos financieros**: Los importes de liquidaciones y apoyos gubernamentales requieren precisión exacta
2. **IntelliSense**: Detección de errores antes de ejecución
3. **Refactoring seguro**: Rename y move sin rompe código
4. **Contracts**: Zod + TypeScript = validación runtime y compile-time

### PostgreSQL

**Por qué PostgreSQL:**

1. **Integridad referencial**: Relaciones complejas socio→parcela→cosecha→entrada→liquidación
2. **Trazabilidad**: Norma "residuos cero" requiere historial completo por parcela
3. **ACID**: Transacciones financieras (liquidaciones) requieren atomicidad
4. **Índices**: B-tree para búsquedas por número socio, fechas

### TanStack Query

**Por qué TanStack Query:**

1. **Cache automático**: Evita refetch innecesario
2. **Loading states**:Estados integrados
3. **Retry automático**: Conexión lenta
4. **Invalidación automática**: Post mutations

### Zod

**Por qué Zod:**

1. **Validación estricta**: Humedad 0-100%, temperatura -20 a 60°C
2. **Type inference**: De schema a TypeScript
3. **Mensajes personalizados**: Errores claros para usuario

---

## Testing

### Unit Tests (Vitest)

```bash
# Backend
cd backend
npm test
```

Tests para lógica de liquidaciones:
- Cálculo de importe bruto
- Cálculo de apoyo gubernamental
- Validaciones de parámetros

### E2E Tests (Playwright)

```bash
# Instalar Playwright
npx playwright install

# Ejecutar tests E2E
npx playwright test
```

Tests E2E:
- Login y autenticación
- Recepción de camión
- Muestreo de humedad
- Almacenamiento en silo
- Registro APPCC de frutas

---

## Documentación Adicional

### Validaciones Zod

```typescript
// Entrada de almacén
{
  peso: z.number().positive().max(50000),
  humedad: z.number().min(0).max(100),
  temperatura: z.number().min(-20).max(60),
  impurezas: z.number().min(0).max(100)
}

// Control APPCC frutas
{
  azucar: z.number().min(0).max(30),
  dureza: z.number().positive().max(20),
  defectos: z.number().min(0).max(100)
}
```

### Cálculo de Liquidaciones

```
importeBruto = totalKilos × precioBaseCampaña
apoyoGobierno = importeBruto × porcentajeApoyo
importeTotal = importeBruto + apoyoGobierno
```

---

## Licencia

MIT

## Autores

- Equipo CASI
