export async function notifyPlayer(user, message) {
  try {
    const dm = await user.createDM();
    await dm.send(typeof message === 'string' ? { content: message } : message);
  } catch (error) {
    console.error(`Error sending DM to ${user.tag}:`, error);
  }
}

export async function notifyTournamentPlayers(client, players, message) {
  for (const playerId of players) {
    try {
      const user = await client.users.fetch(playerId);
      await notifyPlayer(user, message);
    } catch (error) {
      console.error(`Error notifying ${playerId}:`, error);
    }
  }
}

export function getConfirmationButtons() {
  return [
    {
      type: 1,
      components: [
        { type: 2, style: 3, label: 'Confirmar ✅', custom_id: 'confirm_attendance', emoji: '✅' },
        { type: 2, style: 4, label: 'Cancelar ❌', custom_id: 'cancel_attendance', emoji: '❌' }
      ]
    }
  ];
}
