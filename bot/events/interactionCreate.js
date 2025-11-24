import { Matches } from '../utils/db.js';
import { recordWin } from '../utils/tournament.js';

export async function handle(interaction) {
  if (!interaction.isButton()) return;

  try {
    const [action, ...args] = interaction.customId.split('_');

    if (action === 'report' && args[0] === 'win') {
      const matchId = args.slice(1).join('_');
      const match = await Matches.findOne({ id: matchId });
      if (!match) return interaction.reply({ content: '❌ Partida no encontrada', ephemeral: true });

      await Matches.setWinner(matchId, interaction.user.id);
      await recordWin(interaction.user.id, match.player1 === interaction.user.id ? match.player2 : match.player1);
      return interaction.reply({ content: `🏆 Victoria registrada`, ephemeral: true });
    }

    if (action === 'confirm' && args[0] === 'attendance') {
      return interaction.reply({ content: '✅ Asistencia confirmada', ephemeral: true });
    }

    if (action === 'cancel' && args[0] === 'attendance') {
      return interaction.reply({ content: '❌ Asistencia cancelada', ephemeral: true });
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
  }
}
