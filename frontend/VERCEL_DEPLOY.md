# Guía de Despliegue Frontend en Vercel

## 📋 Configuración Actual

El frontend ya está configurado para:
- ✅ Usar `VITE_API_URL` para conectar al backend
- ✅ SPA routing con `vercel.json`
- ✅ Alias `@/` resuelto en Vite

## 🚀 Pasos para Desplegar

### 1. Configurar Variable de Entorno

Tu backend ya está en:
```
https://backend-csc1oslyt-gxbriel96s-projects.vercel.app/api
```

Desde la carpeta `frontend/`, configura la variable:

```bash
vercel env add VITE_API_URL
# Ingresa: https://backend-csc1oslyt-gxbriel96s-projects.vercel.app/api
```

O en el dashboard de Vercel:
1. Ve a tu proyecto frontend
2. Settings → Environment Variables
3. Add Variable:
   - Name: `VITE_API_URL`
   - Value: `https://backend-csc1oslyt-gxbriel96s-projects.vercel.app/api`
   - Environment: Production

### 2. Desplegar

```bash
# Desde frontend/
vercel --prod
```

O simplemente:
```bash
vercel
```
Y selecciona las opciones por defecto.

## 🔧 Configuración de CORS (Importante)

Tu backend necesita saber la URL del frontend. Ve al backend y actualiza:

```bash
cd ../backend
vercel env add FRONTEND_URL
# Ingresa: https://tu-frontend.vercel.app (la URL que te da Vercel)
vercel --prod
```

## 📱 URLs Después del Despliegue

- **Frontend**: `https://casi-frontend-xxx.vercel.app`
- **Backend**: `https://backend-csc1oslyt-gxbriel96s-projects.vercel.app/api`

## ⚠️ Solución de Problemas

### Error: "Cannot connect to backend"
Verifica que `VITE_API_URL` esté configurada correctamente en las variables de entorno del frontend.

### Error CORS
1. Verifica que `FRONTEND_URL` en el backend coincida exactamente con la URL del frontend
2. Asegúrate de que el backend esté desplegado (`vercel --prod` en la carpeta backend)

### Rutas no funcionan al recargar
El `vercel.json` ya está configurado para SPA routing. Si hay problemas, verifica que el archivo esté en la raíz del frontend.

## 🔄 Despliegue Automático

Conecta tu repo de GitHub en el dashboard de Vercel para despliegue automático en cada push.

1. Dashboard de Vercel → Add New Project
2. Import from GitHub
3. Selecciona el repo `Gxbriel96/CASI`
3. Root Directory: `frontend`
4. Framework Preset: Vite
5. Deploy
