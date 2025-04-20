
//const API_URL = '${import.meta.env.VITE_API_URL}/api';
const API_URL = '/api';

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