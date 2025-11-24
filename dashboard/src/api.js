const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  getTournaments: (guildId) => fetch(`${API_URL}/api/torneos?guildId=${guildId}`).then(r => r.json()),
  getTournament: (id) => fetch(`${API_URL}/api/torneo/${id}`).then(r => r.json()),
  getRanking: () => fetch(`${API_URL}/api/ranking`).then(r => r.json()),
  getBracket: (id) => fetch(`${API_URL}/api/bracket?id=${id}`).then(r => r.json())
};
