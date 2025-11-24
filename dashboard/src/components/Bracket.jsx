import { useState, useEffect } from 'react';
import { api } from '../api';

function Bracket({ id }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBracket(id).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Cargando...</div>;
  if (!data) return <div className="container">Error cargando bracket</div>;

  return (
    <div className="container">
      <h2>🎮 Bracket</h2>
      <div className="bracket">
        {data.matches?.map(match => (
          <div key={match.id} className="match-card">
            <div className="match-players">
              <span>{match.player1}</span><span>vs</span><span>{match.player2}</span>
            </div>
            <div className="match-status">
              {match.status === 'completed' && <p>🏆 {match.winner}</p>}
              {match.status === 'pending' && <p>⏳ Pendiente</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bracket;
