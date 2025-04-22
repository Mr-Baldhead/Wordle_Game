import { wordle } from './wordle.js';

// In-memory storage för aktiva spelsessioner
const gameSessions = new Map();

// Generera ett unikt sessions-ID
const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const gameManager = {
  // Skapa en ny spelsession
  createSession(word) {
    const sessionId = generateSessionId();
    
    gameSessions.set(sessionId, {
      word,
      startTime: Date.now(),
      guesses: [],
      gameOver: false,
      won: false
    });
    
    return { 
      sessionId, 
      wordLength: word.length
    };
  },
  
  // Hantera en gissning
  makeGuess(sessionId, guess) {
    const session = gameSessions.get(sessionId);
    
    // Validera session
    if (!session) {
      return { error: 'Ogiltig spelsession' };
    }
    
    // Kontrollera om spelet redan är klart
    if (session.gameOver) {
      return { error: 'Spelet är redan avslutat' };
    }
    
    // Validera längden på gissningen
    if (guess.length !== session.word.length) {
      return { error: `Ordet måste vara ${session.word.length} bokstäver långt` };
    }
    
    // Generera feedback med wordle-logiken
    const feedback = wordle(guess, session.word);
    
    // Lägg till gissningen i sessionen
    session.guesses.push({ guess, feedback });
    
    // Kontrollera om användaren har vunnit
    const hasWon = guess.toLowerCase() === session.word.toLowerCase();
    if (hasWon) {
      session.gameOver = true;
      session.won = true;
      session.endTime = Date.now();
      session.timeTaken = (session.endTime - session.startTime) / 1000;
    } 
    // Kontrollera om användaren har förlorat (max 6 gissningar)
    else if (session.guesses.length >= 6) {
      session.gameOver = true;
      session.endTime = Date.now();
      session.timeTaken = (session.endTime - session.startTime) / 1000;
    }
    
    return {
      feedback,
      guessCount: session.guesses.length,
      gameOver: session.gameOver,
      won: session.won,
      word: session.gameOver ? session.word : null, // Skicka bara ordet om spelet är slut
      timeTaken: session.gameOver ? session.timeTaken : null
    };
  },
  
  // Avsluta spelet (när användaren ger upp)
  endGame(sessionId) {
    const session = gameSessions.get(sessionId);
    
    if (!session) {
      return { error: 'Ogiltig spelsession' };
    }
    
    session.gameOver = true;
    session.endTime = Date.now();
    session.timeTaken = (session.endTime - session.startTime) / 1000;
    
    return {
      guessCount: session.guesses.length,
      word: session.word,
      timeTaken: session.timeTaken
    };
  },
  
  // Hämta information om en session
  getSession(sessionId) {
    const session = gameSessions.get(sessionId);
    if (!session) return null;
    
    return {
      wordLength: session.word.length,
      guessCount: session.guesses.length,
      gameOver: session.gameOver,
      won: session.won,
      timeTaken: session.gameOver ? session.timeTaken : null
    };
  },
  
  // Städa gamla sessioner
  cleanupSessions() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    for (const [id, session] of gameSessions.entries()) {
      if (session.startTime < oneDayAgo) {
        gameSessions.delete(id);
      }
    }
  }
};