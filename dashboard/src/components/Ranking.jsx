import { useState, useEffect } from 'react';
import { api } from '../api';

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRanking().then(setRanking).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <div className="container">
      <h2>🏅 Ranking Global</h2>
      <div className="ranking-table">
        <div className="ranking-header">
          <span>Pos</span><span>Usuario</span><span>Victorias</span><span>Derrotas</span><span>Rating</span>
        </div>
        {ranking.slice(0, 20).map((p, i) => (
          <div key={p._id} className="ranking-row">
            <span>#{i + 1}</span><span>{p.userId}</span><span>{p.wins || 0}</span><span>{p.losses || 0}</span><span>{p.rating || 1500}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ranking;
