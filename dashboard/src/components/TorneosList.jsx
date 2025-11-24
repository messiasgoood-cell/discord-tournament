import { useState, useEffect } from 'react';
import { api } from '../api';

function TorneosList({ guildId, onSelect }) {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!guildId) return;
    setLoading(true);
    api.getTournaments(guildId).then(setTorneos).catch(console.error).finally(() => setLoading(false));
  }, [guildId]);

  if (!guildId) return <div className="container">Ingresa un Guild ID</div>;
  if (loading) return <div className="container">Cargando...</div>;
  if (torneos.length === 0) return <div className="container">No hay torneos</div>;

  return (
    <div className="container">
      <h2>📅 Torneos Disponibles</h2>
      <div className="torneos-grid">
        {torneos.map(t => (
          <div key={t.id} className="torneo-card" onClick={() => onSelect(t)}>
            <h3>{t.name}</h3>
            <p>Estado: {t.status}</p>
            <p>Max: {t.maxPlayers}</p>
            <button>Ver Bracket →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TorneosList;
