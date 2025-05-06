
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Hämta slumpmässigt ord
export async function getRandomWord(length = 5, allowDuplicates = false) {
  console.log('Anropar API med:', { length, allowDuplicates });
  
  try {
    const response = await fetch(
      `${API_URL}/random-word?length=${length}&allowDuplicates=${allowDuplicates}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunde inte hämta ord från servern');
    }
    
    const data = await response.json();
    console.log('API svarade med:', data);
    return { word: data.data };
  } catch (error) {
    console.error('Fel vid hämtning av ord:', error);
    return { error: error.message };
  }
}

// Starta ett nytt spel
export async function startGame(length = 5, allowDuplicates = false) {
  try {
    const response = await fetch(`${API_URL}/game/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ length, allowDuplicates })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunde inte starta spelet');
    }
    
    const data = await response.json();
    return {
      sessionId: data.sessionId,
      wordLength: data.wordLength
    };
  } catch (error) {
    console.error('Fel vid start av spel:', error);
    return { error: error.message };
  }
}

// Skicka en gissning
export async function makeGuess(sessionId, guess) {
  try {
    const response = await fetch(`${API_URL}/game/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, guess })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunde inte utvärdera gissningen');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fel vid gissning:', error);
    return { error: error.message };
  }
}

// Avsluta spel (ge upp)
export async function endGame(sessionId) {
  try {
    const response = await fetch(`${API_URL}/game/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunde inte avsluta spelet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fel vid avslut av spel:', error);
    return { error: error.message };
  }
}

// Funktion för att spara highscore
export async function saveHighscore(highscoreData) {
  try {

    console.log('Skickar data till server:', highscoreData);
    
    const response = await fetch(`${API_URL}/highscores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(highscoreData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunde inte spara highscore');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Fel vid sparande av highscore:', error);
    return { error: error.message };
  }
}

// Funktion för att hämta highscores
export async function getHighscores() {
  try {
    const response = await fetch(`${API_URL}/highscores`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunde inte hämta highscores');
    }
    
    const data = await response.json();
    return { highscores: data.highscores };
  } catch (error) {
    console.error('Fel vid hämtning av highscores:', error);
    return { error: error.message };
  }
}