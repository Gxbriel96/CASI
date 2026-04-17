# CASI - Frontend

Frontend del sistema de gestión de la Cooperativa Agrícola San Isabel.

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
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

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes shadcn/ui
│   │   ├── layout/       # Sidebar, Header, Layout
│   │   └── providers/    # QueryProvider
│   ├── pages/            # Páginas de la app
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Socios.tsx
│   │   ├── Parcelas.tsx
│   │   ├── Cosechas.tsx
│   │   ├── Entradas.tsx
│   │   ├── ControlCalidad.tsx
│   │   ├── Liquidaciones.tsx
│   │   └── Reportes.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useAuth.tsx   # Autenticación
│   │   ├── useToast.ts  # Notificaciones
│   │   └── useQueries.ts # TanStack Query
│   ├── services/         # API client
│   ├── schemas/          # Zod validations
│   ├── types/            # TypeScript types
│   └── lib/              # Utils
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Páginas del Sistema

### Dashboard
- Métricas globales (socios, parcelas, entradas)
- Gráficas de rendimiento por hectárea
- Ocupación de silos
- Campaña activa

### Socios/Productores
- CRUD completo de socios
- Número de socio automático
- Datos de contacto

### Parcelas
- Gestión de parcelas por socio
- Superficie en hectáreas
- Coordenadas GPS

### Cosechas
- Registro de cosechas por parcela
- Cultivos: Maíz, Trigo, Cebada
- Rendimiento por hectárea

### Almacén/Entradas
- Recepción de cereal
- **Validaciones estrictas:**
  - Humedad: 0-100%
  - Temperatura: -20°C a 60°C
  - Impurezas: 0-100%
  - Peso específico: 0.5-1.5
- Asociación a silos

### Control de Calidad (Frutas)
- Registro APPCC de frutas de hueso
- Especies: Melocotón, Nectarina, Albaricoque, Ciruela
- Calibres: AA, A, B, C
- Parámetros: Azúcar (°Brix), Dureza, Defectos

### Liquidaciones
- Cálculo automático de liquidaciones
- Aplicación de apoyos gubernamentales
- Historial de pagos

### Reportes
- Gráficas de rendimiento por mes
- Top socios por kilos
- Distribución por cultivo

## Setup e Instalación

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev
```

### Variables de Entorno

El frontend usa variables de entorno con prefijo `VITE_` para Vite.

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env
VITE_API_URL=http://localhost:3001/api
```

**Nota**: El puerto debe coincidir con el backend (por defecto 3001).

## Usuario de Prueba

| Campo | Valor |
|-------|-------|
| **Email** | admin@casi.es |
| **Contraseña** | admin123 |
| **Rol** | ADMIN |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar en desarrollo |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build |

## Testing

### E2E Tests

```bash
# Instalar Playwright
npx playwright install

# Ejecutar tests
npx playwright test
```

Los tests E2E se encuentran en `tests/e2e/`:
- Recepción de camión
- Muestreo de humedad
- Almacenamiento en silo
- Registro APPCC de frutas

## Diseño UI

### Colors
- Primary: Verde agrícola (#166534)
- Accent: Ámbar (#F59E0B)
- Background: Light/Dark mode

### Componentes
- shadcn/ui con Tailwind CSS
- Iconos: Lucide React
- Gráficas: Recharts

## Licencia

MIT
