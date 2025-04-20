
import React, { useState, useEffect } from 'react';
import { getHighscores } from '../services/wordService';

function Highscores() {
  const [highscores, setHighscores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighscores = async () => {
      setLoading(true);
      const result = await getHighscores();
      
      if (result.error) {
        setError(result.error);
      } else {
        setHighscores(result.highscores);
      }
      setLoading(false);
    };
    
    fetchHighscores();
  }, []);

  // Funktion för att formatera tid
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) return <div>Laddar highscores...</div>;
  if (error) return <div>Fel vid hämtning av highscores: {error}</div>;
  
  return (
    <div className="highscores">
      <h2>Highscores</h2>
      {highscores.length === 0 ? (
        <p>Inga highscores ännu. Bli den första!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Plats</th>
              <th>Namn</th>
              <th>Tid</th>
              <th>Gissningar</th>
              <th>Längd</th>
              <th>Dubbletter</th>
            </tr>
          </thead>
          <tbody>
            {highscores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td>{formatTime(score.timeTaken)}</td>
                <td>{score.guesses}</td>
                <td>{score.letters} bokstäver</td>
                <td>{score.duplicates ? 'Ja' : 'Nej'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Highscores;