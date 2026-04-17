# Guía de Despliegue en Vercel

## 📋 Cambios Realizados

Tu backend ya está configurado para desplegar en Vercel con Vercel Postgres:

- ✅ `vercel.json` - Configuración serverless
- ✅ `src/index.ts` - Exporta app para Vercel
- ✅ `src/app.ts` - CORS configurado para producción
- ✅ `package.json` - Scripts de build para Vercel
- ✅ `tsconfig.json` - Configuración de tsc-alias
- ✅ `prisma/schema.prisma` - Usa variables de Vercel Postgres

## 🚀 Pasos para Desplegar

### 1. Instalar Vercel CLI (si no lo tienes)
```bash
npm i -g vercel
vercel login
```

### 2. Inicializar proyecto en Vercel
Desde la carpeta `backend/`:
```bash
vercel
```
Sigue las instrucciones:
- Link to existing project? `N` (nuevo)
- Project name: `casi-backend`
- Directory: `./`

### 3. Crear Base de Datos Vercel Postgres
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `casi-backend`
3. Tab **Storage** → **Create Database** → **Postgres**
4. Selecciona región (recomendado `us-east-1`)
5. **Create**

Vercel automáticamente añade estas variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`, `POSTGRES_HOST`, etc.

### 4. Configurar Variables de Entorno Adicionales
```bash
# Desde backend/
vercel env add JWT_SECRET
# Ingresa: tu_secreto_jwt_seguro

vercel env add JWT_REFRESH_SECRET
# Ingresa: tu_refresh_secret_seguro

vercel env add JWT_EXPIRES_IN
# Ingresa: 15m

vercel env add JWT_REFRESH_EXPIRES_IN
# Ingresa: 7d

vercel env add FRONTEND_URL
# Ingresa: https://tu-frontend.vercel.app (o * temporalmente)

vercel env add NODE_ENV
# Ingresa: production
```

### 5. Desplegar
```bash
vercel --prod
```

O conecta tu repo GitHub en el dashboard para despliegue automático.

## 🔧 Comandos Útiles

### Migrar base de datos (después del primer despliegue)
```bash
vercel env add MIGRATE_ON_DEPLOY true
vercel --prod
# Luego quita la variable:
vercel env rm MIGRATE_ON_DEPLOY
```

### Seed de datos (solo una vez)
```bash
# Localmente con la URL de Vercel:
POSTGRES_PRISMA_URL="vercel_postgres_url" npx prisma db seed
```

### Ver logs
```bash
vercel logs casi-backend --tail
```

## 🌐 URLs del Backend

Después del despliegue, tu API estará disponible en:
```
https://casi-backend.vercel.app/api
```

Endpoints principales:
- `GET /api/health` - Health check
- `POST /api/auth/login` - Login
- `GET /api/socios` - Lista de socios
- etc.

## ⚠️ Notas Importantes

1. **Base de datos**: La primera vez que despliegues, las migraciones se ejecutarán automáticamente con `vercel-build`.

2. **Prisma Client**: Se genera automáticamente en el build con `postinstall`.

3. **CORS**: Actualiza `FRONTEND_URL` con la URL real de tu frontend.

4. **Variables locales vs producción**:
   - Local: Usa `DATABASE_URL` en tu `.env`
   - Producción: Vercel genera `POSTGRES_PRISMA_URL` automáticamente

## 🐛 Troubleshooting

### Error: "Cannot find module '@/*'"
Solución: El build usa `tsc-alias` para resolver paths. Ya configurado en `package.json`.

### Error: "Database connection failed"
Verifica que:
1. La base de datos Vercel Postgres está creada
2. Las variables de entorno están configuradas
3. `POSTGRES_PRISMA_URL` tiene el valor correcto

### Error de CORS
Actualiza `FRONTEND_URL` en las variables de entorno de Vercel con la URL exacta de tu frontend.
