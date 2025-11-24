import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { CONFIG } from '../config.js';
import { Tournaments, Teams } from '../utils/db.js';
import crypto from 'crypto';

const command = new SlashCommandBuilder()
  .setName('panel')
  .setDescription('Panel de administración de torneos')
  .addSubcommand(sub => sub.setName('crear').setDescription('Crear nuevo torneo')
    .addStringOption(opt => opt.setName('nombre').setDescription('Nombre del torneo').setRequired(true))
    .addIntegerOption(opt => opt.setName('maxjugadores').setDescription('Máximo de jugadores').setRequired(true)))
  .addSubcommand(sub => sub.setName('editar').setDescription('Editar torneo')
    .addStringOption(opt => opt.setName('id').setDescription('ID del torneo').setRequired(true))
    .addStringOption(opt => opt.setName('nombre').setDescription('Nuevo nombre')))
  .addSubcommand(sub => sub.setName('eliminar').setDescription('Eliminar torneo')
    .addStringOption(opt => opt.setName('id').setDescription('ID del torneo').setRequired(true)))
  .addSubcommand(sub => sub.setName('iniciar').setDescription('Iniciar torneo')
    .addStringOption(opt => opt.setName('id').setDescription('ID del torneo').setRequired(true)))
  .addSubcommand(sub => sub.setName('inscritos').setDescription('Ver inscritos')
    .addStringOption(opt => opt.setName('id').setDescription('ID del torneo').setRequired(true)))
  .addSubcommand(sub => sub.setName('notificar').setDescription('Notificar jugadores')
    .addStringOption(opt => opt.setName('id').setDescription('ID del torneo').setRequired(true))
    .addStringOption(opt => opt.setName('mensaje').setDescription('Mensaje a enviar').setRequired(true)));

export async function execute(interaction) {
  const hasAdminRole = CONFIG.ADMIN_ROLES.some(roleId => 
    interaction.member.roles.cache.has(roleId)
  );

  if (!hasAdminRole) {
    return interaction.reply({ content: '❌ No tienes permisos.', ephemeral: true });
  }

  const subcommand = interaction.options.getSubcommand();
  const id = interaction.options.getString('id');

  if (subcommand === 'crear') {
    const nombre = interaction.options.getString('nombre');
    const maxJugadores = interaction.options.getInteger('maxjugadores');
    const toreoId = `torneo-${crypto.randomBytes(4).toString('hex')}`;

    await Tournaments.create(toreoId, nombre, maxJugadores, interaction.guildId);

    const embed = new EmbedBuilder()
      .setColor('#9C27B0')
      .setTitle('✅ Torneo Creado')
      .addFields({ name: 'Nombre', value: nombre }, { name: 'Max Jugadores', value: maxJugadores.toString() }, { name: 'ID', value: toreoId });

    return interaction.reply({ embeds: [embed] });
  }

  if (subcommand === 'editar') {
    const nombre = interaction.options.getString('nombre');
    const torneo = await Tournaments.getById(id);
    if (!torneo) return interaction.reply({ content: '❌ Torneo no encontrado', ephemeral: true });
    await Tournaments.update(id, { name: nombre || torneo.name });
    return interaction.reply({ content: `✅ Torneo actualizado`, ephemeral: true });
  }

  if (subcommand === 'eliminar') {
    await Tournaments.delete(id);
    return interaction.reply({ content: `✅ Torneo eliminado`, ephemeral: true });
  }

  if (subcommand === 'iniciar') {
    await Tournaments.update(id, { status: 'in_progress', startedAt: Date.now() });
    return interaction.reply({ content: `🚀 Torneo iniciado`, ephemeral: true });
  }

  if (subcommand === 'inscritos') {
    const inscritos = await Teams.getByTournament(id);
    if (inscritos.length === 0) return interaction.reply({ content: '📋 No hay inscritos', ephemeral: true });
    const lista = inscritos.map(t => `<@${t.userId}> - ${t.teamName || 'Sin equipo'}`).join('\n');
    const embed = new EmbedBuilder().setColor('#9C27B0').setTitle('📋 Inscritos').setDescription(lista);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (subcommand === 'notificar') {
    const mensaje = interaction.options.getString('mensaje');
    const inscritos = await Teams.getByTournament(id);
    for (const team of inscritos) {
      try {
        const user = await interaction.client.users.fetch(team.userId);
        await user.send(mensaje);
      } catch (error) {
        console.error(`Error notifying ${team.userId}:`, error);
      }
    }
    return interaction.reply({ content: `✅ Notificación enviada a ${inscritos.length} jugadores`, ephemeral: true });
  }
}

export { command };
