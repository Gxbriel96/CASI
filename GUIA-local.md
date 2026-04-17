# Guía para Probar el Sistema CASI en Local

## Requisitos Previos

- Node.js 18+ instalado
- Docker Desktop instalado y ejecutándose
- Git (opcional)

---

## Paso 1: Levantar la Base de Datos (PostgreSQL)

```bash
cd "CASI - Proyecto/backend"
docker compose up -d
```

Esto inicia:
- **PostgreSQL** en puerto 5432
- **Adminer** (gestor web) en http://localhost:8080

---

## Paso 2: Configurar y Ejecutar el Backend

```bash
cd "CASI - Proyecto/backend"

# Instalar dependencias
npm install

# Crear archivo .env (si no existe)
cp .env.example .env

# Ejecutar migraciones de base de datos
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Iniciar servidor
npm run dev
```

**El backend estará en:** http://localhost:3000

---

## Paso 3: Ejecutar el Frontend

Abre una nueva terminal:

```bash
cd "CASI - Proyecto/frontend"

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**El frontend estará en:** http://localhost:5173

---

## Paso 4: Crear Usuario Inicial

1. Abre http://localhost:5173 en tu navegador
2. Deberías ver la página de login
3. Como no hay usuarios, necesitas crear uno

**Opción A: Desde Adminer (más fácil)**
1. Ve a http://localhost:8080
2. Inicia sesión:
   - Servidor: `postgres`
   - Usuario: `casi_user`
   - Contraseña: `casi_pass`
   - Base de datos: `casi`
3. Ve a la tabla **Usuario** y agrega un registro:
   ```json
   {
     "id": "generar-uuid",
     "email": "admin@casi.es",
     "password": "hash-de-admin123",
     "rol": "ADMIN"
   }
   ```

**Opción B: Desde el código (temporal)**

En `backend/src/index.ts`, agregar un seeding básico:

```typescript
// Al inicio del archivo, después de las importaciones
import { prisma } from './config/database';
import bcrypt from 'bcrypt';

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.usuario.upsert({
    where: { email: 'admin@casi.es' },
    update: {},
    create: {
      email: 'admin@casi.es',
      password: hashedPassword,
      rol: 'ADMIN',
      nombre: 'Administrador',
    },
  });
  
  console.log('Usuario admin creado');
}

seed().catch(console.error);
```

Luego ejecuta `npm run dev` una vez y comenta el código de seeding.

---

## Paso 5: Probar el Sistema

### Login
1. Ve a http://localhost:5173
2. Inicia sesión con:
   - **Email:** admin@casi.es
   - **Contraseña:** admin123

### Navegación
- **Dashboard** - Métricas y gráficos
- **Socios** - CRUD de productores
- **Parcelas** - Trazabilidad agrícola
- **Recepción** - Registro de cereals
- **Frutas** - Control APPCC
- **Silos** - Gestión de almacenamiento
- **Liquidaciones** - Pagos y apoyos

---

## Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que Docker esté corriendo
docker ps

# Si postgres no está, recrear
docker compose down
docker compose up -d
```

### Error de puerto ocupado
- Backend: cambiar puerto en `.env` o matar proceso
- Frontend: cambiar puerto en `vite.config.ts`

### Prisma error: "Can't reach database server"
```bash
# Verificar URL de conexión en .env
DATABASE_URL="postgresql://casi_user:casi_pass@localhost:5432/casi"
```

---

## Comandos Útiles

| Descripción | Comando |
|-------------|---------|
| Ver base de datos | http://localhost:8080 |
| Health check API | http://localhost:3000/api/health |
| Ver errores backend | En terminal de npm run dev |
| Regenerar Prisma | `npx prisma generate` |
| Reset base de datos | `npx prisma migrate reset` |

---

## Próximos Pasos (Opcional)

1. **Crear campaña activa** - Ve a la API o crea datos de prueba
2. **Agregar socios de prueba** - Desde la interfaz admin
3. **Probar portal de socio** - Crea usuario con rol SOCIO

¿Necesitas ayuda con algún paso específico?