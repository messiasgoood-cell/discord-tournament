import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, Collection } from 'discord.js';
import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { connectDB, Tournaments, Teams, Ranking, Matches } from './utils/db.js';
import { command as panelCommand, execute as panelExecute } from './commands/panel.js';
import { command as torneosCommand, execute as torneosExecute } from './commands/torneos.js';
import { handle as handleInteraction } from './events/interactionCreate.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages] });
const commands = [panelCommand, torneosCommand];

// DB - Conectar sin esperar
connectDB().catch(e => console.error('⚠️ MongoDB error:', e.message));

// Register commands
async function registerCommands() {
  try {
    console.log('📝 Registrando comandos...');
    const rest = new REST({ version: '10' }).setToken(CONFIG.TOKEN);
    await rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), { body: commands.map(cmd => cmd.toJSON()) });
    console.log('✅ Comandos registrados');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === 'panel') return panelExecute(interaction);
    if (interaction.commandName === 'torneos') return torneosExecute(interaction);
  } else if (interaction.isButton()) {
    return handleInteraction(interaction);
  }
});

// Express API
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/torneos', async (req, res) => {
  const guildId = req.query.guildId;
  if (!guildId) return res.status(400).json({ error: 'guildId required' });
  const torneos = await Tournaments.getAll(guildId);
  res.json(torneos);
});

app.get('/api/torneo/:id', async (req, res) => {
  const torneo = await Tournaments.getById(req.params.id);
  if (!torneo) return res.status(404).json({ error: 'not found' });
  const participants = await Teams.getByTournament(req.params.id);
  const matches = await Matches.getByTournament(req.params.id);
  res.json({ ...torneo, participants, matches });
});

app.get('/api/ranking', async (req, res) => {
  const ranking = await Ranking.getAll();
  res.json(ranking);
});

app.listen(CONFIG.PORT, () => {
  console.log(`🌐 API running on port ${CONFIG.PORT}`);
});

registerCommands();
client.login(CONFIG.TOKEN);
