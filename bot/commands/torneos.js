import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Tournaments, Teams, Ranking } from '../utils/db.js';

const command = new SlashCommandBuilder()
  .setName('torneos')
  .setDescription('Gestiona torneos y participación')
  .addSubcommand(sub => sub.setName('disponibles').setDescription('Ver torneos disponibles'))
  .addSubcommand(sub => sub.setName('inscribirse').setDescription('Inscribirse a un torneo')
    .addStringOption(opt => opt.setName('id').setDescription('ID del torneo').setRequired(true))
    .addStringOption(opt => opt.setName('nombre').setDescription('Nombre del equipo')))
  .addSubcommand(sub => sub.setName('bracket').setDescription('Ver bracket')
    .addStringOption(opt => opt.setName('id').setDescription('ID del torneo').setRequired(true)))
  .addSubcommand(sub => sub.setName('ranking').setDescription('Ver ranking global'))
  .addSubcommand(sub => sub.setName('estadisticas').setDescription('Ver tus estadísticas'));

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'disponibles') {
    const torneos = await Tournaments.getAll(interaction.guildId);
    const disponibles = torneos.filter(t => t.status === 'pending');
    if (disponibles.length === 0) return interaction.reply({ content: '📅 No hay torneos disponibles', ephemeral: true });
    const embeds = disponibles.map(t => 
      new EmbedBuilder().setColor('#9C27B0').setTitle(t.name)
        .addFields({ name: 'Max Jugadores', value: t.maxPlayers?.toString() || 'N/A' }, { name: 'ID', value: `\`${t.id}\`` })
    );
    return interaction.reply({ embeds, ephemeral: true });
  }

  if (subcommand === 'inscribirse') {
    const id = interaction.options.getString('id');
    const teamName = interaction.options.getString('nombre') || interaction.user.username;
    const torneo = await Tournaments.getById(id);
    if (!torneo) return interaction.reply({ content: '❌ Torneo no encontrado', ephemeral: true });
    await Teams.join(id, interaction.user.id, teamName);
    return interaction.reply({ content: `✅ Inscrito al torneo **${torneo.name}** como **${teamName}**`, ephemeral: true });
  }

  if (subcommand === 'bracket') {
    const id = interaction.options.getString('id');
    const torneo = await Tournaments.getById(id);
    if (!torneo) return interaction.reply({ content: '❌ Torneo no encontrado', ephemeral: true });
    const inscritos = await Teams.getByTournament(id);
    const embed = new EmbedBuilder().setColor('#9C27B0').setTitle(`🏆 ${torneo.name}`)
      .addFields({ name: 'Estado', value: torneo.status }, { name: 'Participantes', value: inscritos.length.toString() });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (subcommand === 'ranking') {
    const ranking = await Ranking.getAll();
    if (ranking.length === 0) return interaction.reply({ content: '📊 No hay datos', ephemeral: true });
    const top10 = ranking.slice(0, 10);
    const lista = top10.map((r, i) => `#${i + 1} <@${r.userId}> - 🏆 ${r.wins} | 💔 ${r.losses}`).join('\n');
    const embed = new EmbedBuilder().setColor('#FFD700').setTitle('🏅 Ranking Global').setDescription(lista);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (subcommand === 'estadisticas') {
    const stats = await Ranking.get(interaction.user.id);
    if (!stats) return interaction.reply({ content: '📊 No tienes estadísticas', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#9C27B0').setTitle(`📊 Estadísticas`)
      .addFields({ name: 'Victorias', value: stats.wins?.toString() || '0', inline: true },
        { name: 'Derrotas', value: stats.losses?.toString() || '0', inline: true },
        { name: 'Rating', value: stats.rating?.toString() || '1500', inline: true });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export { command };
