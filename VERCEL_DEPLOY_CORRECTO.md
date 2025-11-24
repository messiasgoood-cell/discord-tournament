# 🚀 ARREGLAR VERCEL - INSTRUCCIONES EXACTAS

Tu dashboard da 404 porque falta configuración. Sigue EXACTAMENTE esto:

---

## PASO 1: Ve a tu Dashboard en Vercel

Abre: https://vercel.com/dashboard

Busca el proyecto `discord-tournament`

---

## PASO 2: Click en Settings (Configuración)

1. En tu proyecto, busca **"Settings"** (pestaña)
2. Click en él

---

## PASO 3: Configura Build & Output

1. Busca **"Build & Output Settings"**
2. Click en **"Edit"** (si está grayed)

Configura EXACTAMENTE así:
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dashboard/dist` ← IMPORTANTE
- **Install Command**: `npm install`

Click **Save**

---

## PASO 4: Configura Raíz de Proyecto

1. Vuelve a Settings
2. Busca **"Root Directory"**
3. Cambia a: `dashboard`
4. Click **Save**

---

## PASO 5: Configura Variables

1. Ve a **"Environment Variables"**
2. Elimina las que hay (si existen)
3. Agrega NUEVAS:

**Variable 1:**
- Name: `MONGODB_URI`
- Value: 
```
mongodb+srv://deividdarosa4_db_user:tHEU2MKjhaUUEWU7@cluster0.ymg4fkh.mongodb.net/discord-tournament?retryWrites=true&w=majority
```
- Click **Add**

**Variable 2:**
- Name: `VITE_API_URL`
- Value: `https://discord-tournament.replit.dev`
- Click **Add**

---

## PASO 6: Redeploy

1. Ve a **"Deployments"** (pestaña)
2. Busca el último deployment (el que falló)
3. Click en los 3 puntitos (...) 
4. Click **"Redeploy"**
5. Click **"Redeploy"** de nuevo (confirmar)

---

## Espera 2-3 minutos

Cuando diga **"Ready"** o ✅, abre tu URL

**¡Listo!** 🎉

---

## Si sigue fallando:

1. Ve a **"Deployments"**
2. Click en el último
3. Busca "Build logs"
4. Copia el error y manda captura

---

## Tu URL será:
`https://tournament-dashboard-xxxx.vercel.app`

(O tu dominio personalizado si lo configuraste)
