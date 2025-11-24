import { useState, useEffect } from 'react';
import './App.css';
import TorneosList from './components/TorneosList';
import Ranking from './components/Ranking';
import Bracket from './components/Bracket';

function App() {
  const [currentView, setCurrentView] = useState('torneos');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [guildId, setGuildId] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/torneos?guildId=1`);
        setApiStatus(response.ok ? 'connected' : 'error');
      } catch (e) {
        setApiStatus('error');
      }
    };
    checkApi();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1>🏆 TORNEO MANAGER</h1>
          <div className={`api-status ${apiStatus}`}>
            <span className="status-dot"></span>
            {apiStatus === 'connected' ? '✅ Bot Conectado' : apiStatus === 'checking' ? '⏳ Verificando...' : '❌ Bot Desconectado'}
          </div>
        </div>
        <div className="guild-input">
          <label>Guild ID:</label>
          <input 
            type="text" 
            placeholder="Ej: 123456789" 
            value={guildId} 
            onChange={(e) => setGuildId(e.target.value)} 
          />
          {guildId && <small>✅ Guild ID ingresado</small>}
        </div>
      </header>

      <nav className="nav">
        <button 
          className={currentView === 'torneos' ? 'active' : ''} 
          onClick={() => setCurrentView('torneos')}
        >
          📅 Torneos
        </button>
        <button 
          className={currentView === 'ranking' ? 'active' : ''} 
          onClick={() => setCurrentView('ranking')}
        >
          🏅 Ranking Global
        </button>
        {selectedTournament && (
          <button 
            className={currentView === 'bracket' ? 'active' : ''} 
            onClick={() => setCurrentView('bracket')}
          >
            🎮 {selectedTournament.name}
          </button>
        )}
      </nav>

      <main className="main">
        {!guildId && (
          <div className="welcome-box">
            <h2>👋 Bienvenido al Gestor de Torneos</h2>
            <p>Ingresa tu <strong>Guild ID</strong> arriba para ver tus torneos en tiempo real</p>
            <div className="welcome-features">
              <div>📅 Ver todos tus torneos</div>
              <div>🏆 Seguir el ranking</div>
              <div>🎮 Visualizar brackets</div>
            </div>
          </div>
        )}
        
        {guildId && currentView === 'torneos' && <TorneosList guildId={guildId} onSelect={(t) => { setSelectedTournament(t); setCurrentView('bracket'); }} />}
        {currentView === 'ranking' && <Ranking />}
        {currentView === 'bracket' && selectedTournament && <Bracket id={selectedTournament.id} />}
      </main>
    </div>
  );
}

export default App;
