import React from 'react';
import './Settings.css';

function Settings({ 
  wordLength, 
  setWordLength, 
  allowDuplicates, 
  setAllowDuplicates, 
  startGame, 
  loading,
  warning 
}) {
  return (
    <div className="settings">
      <h1>Game Settings</h1>
      
      {warning && <div className="warning">{warning}</div>}
      
      <div className="setting-group">
        <label>
          Ordlängd:
          <input
            type="number"
            min="4"
            max="8"
            value={wordLength}
            onChange={(e) => setWordLength(parseInt(e.target.value) || 5)}
          />
        </label>
      </div>
      
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
          />
          Tillåt upprepade bokstäver
        </label>
      </div>
      
      <button 
        onClick={startGame} 
        disabled={loading}
        className="start-game-btn"
      >
        {loading ? 'Laddar...' : 'Starta spelet'}
      </button>
    </div>
  );
}

export default Settings;