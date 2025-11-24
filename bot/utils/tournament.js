import { Matches, Teams, Players, Ranking } from './db.js';
import crypto from 'crypto';

export async function generateBracket(tournamentId, players) {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const matches = [];
  
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    const matchId = `match-${crypto.randomBytes(4).toString('hex')}`;
    await Matches.create(matchId, tournamentId, shuffled[i].userId, shuffled[i + 1].userId);
    matches.push(matchId);
  }
  
  return matches;
}

export async function recordWin(winnerId, loserId) {
  const winner = await Players.getOrCreate(winnerId, 'Player');
  const loser = await Players.getOrCreate(loserId, 'Player');
  
  const newWinnerRating = Math.max(1200, (winner.rating || 1500) + 20);
  const newLoserRating = Math.max(1200, (loser.rating || 1500) - 20);
  
  await Ranking.update(winnerId, (winner.wins || 0) + 1, winner.losses || 0, newWinnerRating);
  await Ranking.update(loserId, loser.wins || 0, (loser.losses || 0) + 1, newLoserRating);
}

export function createTemporaryRole(guild, tournamentName) {
  return guild.roles.create({
    name: `Jugador-${tournamentName.slice(0, 10)}`,
    color: '#9C27B0',
    permissions: []
  });
}

export function createTemporaryChannel(guild, tournamentName, roleId) {
  return guild.channels.create({
    name: `torneo-${tournamentName.toLowerCase().slice(0, 20)}`,
    type: 0,
    permissionOverwrites: [
      { id: guild.id, deny: ['ViewChannel'] },
      { id: roleId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }
    ]
  });
}
