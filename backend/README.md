# CASI - Sistema de Gestión de Cooperativa Agrícola

Backend del sistema de gestión integral para la Cooperativa Agrícola San Isidro.

## Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (access + refresh tokens)
- **Testing**: Vitest

## Estructura del Proyecto (Clean Architecture)

```
backend/
├── src/
│   ├── config/         # Configuración (Prisma client)
│   ├── controllers/    # Manejo de HTTP requests/responses
│   ├── services/       # Lógica de negocio
│   ├── repositories/   # Acceso a datos (Prisma)
│   ├── middleware/     # Auth, validación, errores
│   ├── routes/         # Definición de rutas API
│   ├── types/          # Esquemas de validación Zod
│   └── utils/          # Helpers, errores custom
├── prisma/
│   └── schema.prisma  # Modelo de datos
└── tests/             # Tests unitarios
```

## Modelo de Datos

### Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| `Usuario` | Usuarios del sistema (admin, empleado, socio) |
| `Socio` | Productores registrados |
| `Parcela` | Parcelas con trazabilidad |
| `Cosecha` | Cosechas por parcela (maíz, trigo, cebada) |
| `EntradaAlmacen` | Registro de pesajes de cereal |
| `ControlCalidad` | Análisis de laboratorio (humedad, peso específico) |
| `FrutaControl` | Control APPCC de frutas de hueso |
| `Silo` | Gestión de silos y stock |
| `Liquidacion` | Liquidaciones y apoyos gubernamentales |
| `Campana` | Configuración de campañas (precios, apoyos) |

### Enums

- **Rol**: ADMIN, EMPLEADO, SOCIO
- **TipoCultivo**: MAIZ, TRIGO, CEBADA
- **EspecieFruta**: MELOCOTON, NECTARINA, ALBARICOQUE, CIRUELA
- **Calibre**: AA, A, B, C
- **ResultadoCalidad**: APROBADO, RECHAZADO

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Login con email/password |
| POST | /api/auth/refresh | Refresh token JWT |
| GET | /api/auth/me | Datos del usuario actual |
| POST | /api/auth/register | Registrar nuevo usuario |

### Socios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/socios | Listar socios (paginado) |
| GET | /api/socios/:id | Ver detalle con parcelas |
| POST | /api/socios | Crear nuevo socio |
| PUT | /api/socios/:id | Actualizar socio |
| DELETE | /api/socios/:id | Eliminar socio |
| GET | /api/socios/:id/parcelas | Ver parcelas del socio |
| GET | /api/socios/:id/entradas | Ver entregas del socio |
| GET | /api/socios/:id/liquidaciones | Ver liquidaciones del socio |

### Parcelas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/parcelas | Listar parcelas |
| GET | /api/parcelas/:id | Ver parcela |
| POST | /api/parcelas | Crear parcela |
| PUT | /api/parcelas/:id | Actualizar parcela |
| DELETE | /api/parcelas/:id | Eliminar parcela |
| GET | /api/parcelas/:id/trazabilidad | Historial completo |

### Cosechas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/cosechas | Listar cosechas |
| GET | /api/cosechas/:id | Ver cosecha con entradas |
| POST | /api/cosechas | Crear cosecha |
| PUT | /api/cosechas/:id | Actualizar cosecha |
| DELETE | /api/cosechas/:id | Eliminar cosecha |

### Entradas de Almacén

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/entradas | Listar entradas |
| GET | /api/entradas/:id | Ver detalle entrada |
| POST | /api/entradas | Registrar entrada |
| PUT | /api/entradas/:id | Actualizar entrada |
| DELETE | /api/entradas/:id | Eliminar entrada |

### Control de Calidad

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/control-calidad | Listar controles |
| GET | /api/control-calidad/:id | Ver control |
| POST | /api/control-calidad | Registrar análisis |
| PUT | /api/control-calidad/:id/resultado | Aprobar/rechazar |

### Frutas de Hueso

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/frutas | Listar controles APPCC |
| GET | /api/frutas/:id | Ver control |
| POST | /api/frutas | Registrar control |
| DELETE | /api/frutas/:id | Eliminar control |
| GET | /api/frutas/estadisticas | Estadísticas |

### Silos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/silos | Listar silos |
| GET | /api/silos/:id | Ver silo con entradas |
| POST | /api/silos | Crear silo |
| PUT | /api/silos/:id | Actualizar silo |
| DELETE | /api/silos/:id | Eliminar silo |
| PUT | /api/silos/:id/stock | Actualizar stock |
| GET | /api/silos/resumen/ocupacion | Resumen de ocupación |

### Liquidaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/liquidaciones | Listar liquidaciones |
| GET | /api/liquidaciones/:id | Ver liquidación |
| GET | /api/liquidaciones/socio/:id | Liquidaciones por socio |
| POST | /api/liquidaciones | Crear liquidación manual |
| POST | /api/liquidaciones/calcular | Calcular liquidación automática |
| DELETE | /api/liquidaciones/:id | Eliminar liquidación |
| GET | /api/liquidaciones/estadisticas | Estadísticas |

### Dashboard

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/dashboard/metricas | Métricas globales |
| GET | /api/dashboard/silos | Ocupación de silos |
| GET | /api/dashboard/cultivos | Entradas por cultivo |
| GET | /api/dashboard/top-socios | Top socios por liquidación |

### Campañas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/campanas | Listar campañas |
| GET | /api/campanas/activa | Campaña activa |
| GET | /api/campanas/:id | Ver campaña |
| POST | /api/campanas | Crear campaña |
| PUT | /api/campanas/:id | Actualizar campaña |
| DELETE | /api/campanas/:id | Eliminar campaña |

## Seguridad

- **JWT**: Access token (15 min) + Refresh token (7 días)
- **Roles**: ADMIN, EMPLEADO, SOCIO
- **Middleware**: authenticate + authorize(roles[])
- **Validación**: Zod en todos los endpoints

## Cálculo de Liquidaciones

```
importeBruto = totalKilos × precioBaseCampaña
apoyoGobierno = importeBruto × porcentajeApoyo
importeTotal = importeBruto + apoyoGobierno
```

## Setup

### Requisitos

- Node.js 18+
- PostgreSQL 15+

### Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Opción 1: Docker (recomendado)
docker compose up -d

# Opción 2: PostgreSQL local
# Crear base de datos "casi" y configurar .env

# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Ejecutar tests
npm test
```

### Variables de Entorno

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/casi"
JWT_SECRET=tu_secret_aqui
JWT_REFRESH_SECRET=tu_refresh_secret_aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
```

### Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor en desarrollo |
| `npm run build` | Compilar TypeScript |
| `npm start` | Iniciar servidor en producción |
| `npm test` | Ejecutar tests |
| `npx prisma studio` | Abrir gestor de base de datos |

## Decisiones Técnicas

### TypeScript

Se eligió TypeScript para garantizar type safety en datos financieros (importes de liquidaciones, apoyos gubernamentales) y evitar errores runtime en cálculos críticos.

### PostgreSQL

Se chose PostgreSQL por:
- **Integridad referencial**: Relaciones complejas entre socios, parcelas, cosechas
- **Trazabilidad**: Control Informático de Parcelas para normativa "residuos cero"
- **Confiabilidad**: Datos financieros requieren ACID

### Clean Architecture

Separación en capas (controllers → services → repositories) permite:
- Testabilidad: Servicios sin зависимости de HTTP
- Mantenimiento: Lógica de negocio isolada
- Escalabilidad: Fácil agregar nuevos módulos

## Licencia

MIT