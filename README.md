# 🏆 Discord Tournament Bot + Dashboard

Sistema profesional y completo para gestionar torneos en Discord con dashboard web en tiempo real.

## ✨ Features

- ✅ Bot Discord con comandos slash (`/panel`, `/torneos`)
- ✅ Brackets automáticos según número de inscritos
- ✅ Sistema de ranking ELO
- ✅ Roles y canales temporales por torneo
- ✅ Notificaciones automáticas por DM
- ✅ Dashboard React en tiempo real
- ✅ MongoDB Atlas compartida
- ✅ API REST + Endpoints Serverless
- ✅ 24/7 sin intervención manual
- ✅ Gratis en planes comunitarios

## 🏗️ Arquitectura

```
Discord Server
    ↓ (/commands)
Bot Discord (Replit) ←→ MongoDB Atlas
    ↓                        ↑
API REST (3001)             ↓
    ↓                   Dashboard
Dashboard (Vercel) ←────────┘
    ↓
Navegador Web
```

## 📦 Estructura del Proyecto

```
discord-tournament/
├── bot/
│   ├── commands/          # Comandos slash (/panel, /torneos)
│   ├── events/            # Manejadores de eventos
│   ├── utils/
│   │   ├── db.js          # MongoDB connection
│   │   ├── tournament.js  # Lógica de torneos
│   │   └── notifications.js
│   ├── config.js
│   ├── index.js           # Bot principal + API Express
│   └── package.json
│
├── dashboard/
│   ├── api/               # Endpoints Serverless (Vercel)
│   │   ├── torneos.js
│   │   ├── bracket.js
│   │   └── ranking.js
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── TorneosList.jsx
│   │   │   ├── Ranking.jsx
│   │   │   └── Bracket.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── .env.example
└── README.md
```

## 🎮 Comandos Discord

### Para Admins (`/panel`)
```
/panel crear nombre:"Copa 2025" maxjugadores:8
/panel editar id:"torneo-xxxxx" nombre:"Copa 2025 Final"
/panel eliminar id:"torneo-xxxxx"
/panel iniciar id:"torneo-xxxxx"
/panel inscritos id:"torneo-xxxxx"
/panel notificar id:"torneo-xxxxx" mensaje:"¡Que comience el torneo!"
```

### Para Todos (`/torneos`)
```
/torneos disponibles
/torneos inscribirse id:"torneo-xxxxx" nombre:"Mi Equipo"
/torneos bracket id:"torneo-xxxxx"
/torneos ranking
/torneos estadisticas
```

## 🚀 Instalación & Deploy

### Bot en Replit

1. Ve a https://replit.com/import/github/[username]/discord-tournament
2. Configura variables de entorno:
   - `DISCORD_TOKEN` - Tu token del bot
   - `CLIENT_ID` - ID del cliente Discord
   - `MONGODB_URI` - Connection string de MongoDB
3. Click "Run"

Bot estará en: **https://discord-tournament.replit.dev**

### Dashboard en Vercel

1. Ve a https://vercel.com/import
2. Importa este repositorio
3. **Root Directory**: `dashboard`
4. Configura variables:
   - `MONGODB_URI` - Same as bot
   - `VITE_API_URL` - https://discord-tournament.replit.dev
5. Click "Deploy"

Dashboard estará en: **https://tournament-dashboard-xxx.vercel.app**

### MongoDB Atlas

1. https://cloud.mongodb.com
2. Crea cluster M0 (gratis)
3. Crea usuario con contraseña
4. Whitelist IP: 0.0.0.0/0
5. Copia connection string

## 💻 Desarrollo Local

```bash
# Bot
cd bot
npm install
npm start

# Dashboard (otra terminal)
cd dashboard
npm install
npm run dev
```

Bot: http://localhost:3001
Dashboard: http://localhost:5000

## 📊 Base de Datos

MongoDB Atlas collections:
- `tournaments` - Información de torneos
- `teams` - Equipos/jugadores inscritos
- `matches` - Partidas del torneo
- `ranking` - Ranking global ELO

## 🔐 Seguridad

- Tokens de Discord seguros en variables de entorno
- MongoDB con autenticación
- Validación de permisos (solo admins pueden `/panel`)
- Conexión SSL/TLS

## 📱 Responsive

- Desktop: Grid layout completo
- Tablet: Optimizado
- Mobile: Interfaz adaptada

## 🎨 Design

- Dark theme profesional
- Gradientes morados
- Iconos emoji
- Animaciones suaves

## 📞 Troubleshooting

**Bot no responde:**
- Verifica que el token es válido
- Asegúrate de que el bot tiene permisos en Discord

**MongoDB no conecta:**
- Verifica connection string
- Whitelist tu IP en MongoDB Atlas
- Comprueba usuario/contraseña

**Dashboard no carga datos:**
- Verifica que VITE_API_URL es correcto
- Comprueba que el bot está online

## 📄 Licencia

MIT

## 🤝 Contribuir

Este es un proyecto de código abierto. Las contribuciones son bienvenidas.

## 📞 Soporte

Para issues o preguntas, abre un issue en GitHub.

---

**Made with 💜 for Discord Tournament Management**
