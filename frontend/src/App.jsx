import React, { useState, useEffect } from "react";
import Settings from "./components/Settings";
import { startGame, makeGuess, endGame, saveHighscore } from "./services/wordService";
import "./App.css";

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [sessionId, setSessionId] = useState(null); // Nytt: session-ID för backend-spellogik
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [warning, setWarning] = useState("");
  const [timeTaken, setTimeTaken] = useState(null);
  const [showSettings, setShowSettings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [submittingScore, setSubmittingScore] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [scoreError, setScoreError] = useState(null);
  const [currentWord, setCurrentWord] = useState(null); // Behövs bara för att visa ordet när spelet är slut

  // Asynkron startGame-funktion (uppdaterad för backend-logik)
  const handleStartGame = async () => {
    setLoading(true);
    setWarning("");

    try {
      console.log("Startar spel med inställningar:", {
        wordLength,
        allowDuplicates,
      });
      
      const result = await startGame(wordLength, allowDuplicates);

      if (result.error) {
        console.error("Fel vid start av spel:", result.error);
        setWarning(result.error);
      } else {
        console.log("Spel startat med session:", result.sessionId);
        setSessionId(result.sessionId);
        setGuesses([]);
        setInput("");
        setGameOver(false);
        setWon(false);
        setShowSettings(false); // Dölj inställningar och visa spelet
        setCurrentWord(null); // Rensar tidigare ord
      }
    } catch (error) {
      console.error("Oväntat fel vid start av spel:", error);
      setWarning("Kunde inte starta spelet: " + (error.message || "Okänt fel"));
    } finally {
      setLoading(false);
    }
  };

  // Hantera gissning (uppdaterad för backend-logik)
  const handleGuess = async () => {
    if (!sessionId) {
      setWarning("Ingen aktiv spelsession.");
      return;
    }

    if (input.length !== wordLength) {
      setWarning(`Ordet måste vara ${wordLength} bokstäver långt`);
      return;
    }

    if (gameOver) return;

    setWarning("");
    
    try {
      // Skicka gissningen till backend
      const result = await makeGuess(sessionId, input);
      
      if (result.error) {
        setWarning(result.error);
        return;
      }
      
      // Lägg till gissningen med feedback
      setGuesses([...guesses, { guess: input, feedback: result.feedback }]);
      setInput("");
      
      // Kontrollera om spelet är klart
      if (result.gameOver) {
        setGameOver(true);
        setWon(result.won);
        setTimeTaken(result.timeTaken);
        
        // Om spelet är slut, spara ordet så vi kan visa det
        if (result.word) {
          setCurrentWord(result.word);
        }
      }
    } catch (error) {
      console.error("Fel vid gissning:", error);
      setWarning("Kunde inte hantera gissningen: " + (error.message || "Okänt fel"));
    }
  };

  // Ge upp spelet
  const handleGiveUp = async () => {
    if (!sessionId) return;
    
    try {
      const result = await endGame(sessionId);
      
      if (result.error) {
        setWarning(result.error);
        return;
      }
      
      setGameOver(true);
      setWon(false);
      setTimeTaken(result.timeTaken);
      setCurrentWord(result.word);
    } catch (error) {
      console.error("Fel vid avslut av spel:", error);
      setWarning("Kunde inte avsluta spelet: " + (error.message || "Okänt fel"));
    }
  };

  // Hantera inmatning av namn
  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  // Skicka in highscore
  const submitHighscore = async () => {
    if (!playerName.trim()) {
      setScoreError("Du måste ange ett namn");
      return;
    }

    setSubmittingScore(true);
    setScoreError(null);

    const highscoreData = {
      name: playerName,
      timeTaken: timeTaken,
      guesses: guesses.length,
      letters: wordLength,
      duplicates: allowDuplicates,
    };

    const result = await saveHighscore(highscoreData);

    if (result.error) {
      setScoreError(result.error);
    } else {
      setScoreSubmitted(true);
      //redirecta direkt till highscores-sidan
     window.location.href = "/highscores";
    }

    setSubmittingScore(false);
  };

  // Hantera återställning
  const handleRestart = () => {
    setPlayerName("");
    setScoreSubmitted(false);
    setScoreError(null);
    handleStartGame();
  };

  // Formatera tid till läsbart format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes} ${minutes === 1 ? "minut" : "minuter"} och ${seconds} ${
      seconds === 1 ? "sekund" : "sekunder"
    }`;
  };

  return (
    <div className='App'>
      <header className='game-header'>
        <h1>Wordle-like Game</h1>
        <div className='navigation-buttons'>
          <a
            href="http://localhost:5080/highscores"
            className='navigation-button highscore-button'
          >
            Highscores
          </a>
          <a
            href="http://localhost:5080/info"
            className='navigation-button info-button'
          >
            Om projektet
          </a>
        </div>
      </header>

      {showSettings ? (
        <Settings
          wordLength={wordLength}
          setWordLength={setWordLength}
          allowDuplicates={allowDuplicates}
          setAllowDuplicates={setAllowDuplicates}
          startGame={handleStartGame}
          loading={loading}
          warning={warning}
        />
      ) : (
        <div className='game-container'>
          {warning && <div className='warning'>{warning}</div>}

          {!gameOver ? (
            <div className='game-input'>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.toLowerCase())}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                maxLength={wordLength}
                placeholder={`Ange ett ${wordLength}-bokstavs ord`}
                autoFocus
              />
              <button onClick={handleGuess}>Gissa</button>
              <button onClick={handleGiveUp} className="give-up-btn">Ge upp</button>
            </div>
          ) : null}

          <div className='guesses-container'>
            {guesses.map(({ guess, feedback }, index) => (
              <div key={index} className='guess'>
                {guess.split("").map((letter, i) => (
                  <span key={i} className={`letter ${feedback[i]}`}>
                    {letter}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {gameOver && (
            <div className='game-over'>
              {won ? (
                <div className='winner'>
                  <h2>Grattis! Du hittade ordet!</h2>
                  <p>Tid: {formatTime(timeTaken)}</p>
                  <p>Antal gissningar: {guesses.length}</p>

                  {!scoreSubmitted ? (
                    <div className='highscore-form'>
                      <p>Ange ditt namn för highscore-listan:</p>
                      <input
                        type='text'
                        value={playerName}
                        onChange={handleNameChange}
                        placeholder='Ditt namn'
                        autoFocus
                      />
                      <button
                        onClick={submitHighscore}
                        disabled={submittingScore}
                      >
                        {submittingScore ? "Skickar..." : "Skicka poäng"}
                      </button>
                      {scoreError && <p className='error'>{scoreError}</p>}
                    </div>
                  ) : (
                    <div className='score-submitted'>
                      <p>Din poäng har sparats!</p>
                      <a
                        href='/highscores'
                        className='highscore-link'
                        target='_blank'
                        rel='noopener noreferrer'>
                        Visa highscores
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className='loser'>
                  <p>
                    Game Over! Det rätta ordet var{" "}
                    <strong>{currentWord}</strong>
                  </p>
                  <button onClick={handleRestart}>Spela igen</button>
                  <a
                    href='/highscores'
                    className='highscore-link'
                  >
                    Visa highscores
                  </a>
                </div>
              )}

              {(scoreSubmitted || !won) && (
                <button onClick={handleRestart} className='new-game-btn'>
                  Nytt spel
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <footer className='game-footer'>
        <p>&copy; 2025 Wordle Game | Utvecklad av Jörgen Lindström</p>
      </footer>
    </div>
  );
}

export default App;