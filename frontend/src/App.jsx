import React, { useState, useEffect } from "react";
import Settings from "./components/Settings";
import { wordle } from "./logic/wordle";
import { getRandomWord, saveHighscore } from "./services/wordService";
import "./App.css";

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [warning, setWarning] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [showSettings, setShowSettings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [submittingScore, setSubmittingScore] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [scoreError, setScoreError] = useState(null);

  // Asynkron startGame-funktion
  const startGame = async () => {
    setLoading(true);
    setWarning("");

    try {
      console.log("Startar spel med inställningar:", {
        wordLength,
        allowDuplicates,
      });
      const result = await getRandomWord(wordLength, allowDuplicates);

      if (result.error) {
        console.error("Fel vid start av spel:", result.error);
        setWarning(result.error);
      } else {
        console.log("Spel startat med ord:", result.word);
        setCurrentWord(result.word);
        setGuesses([]);
        setInput("");
        setGameOver(false);
        setWon(false);
        setStartTime(Date.now());
        setShowSettings(false); // Dölj inställningar och visa spelet
      }
    } catch (error) {
      console.error("Oväntat fel vid start av spel:", error);
      setWarning("Kunde inte starta spelet: " + (error.message || "Okänt fel"));
    } finally {
      setLoading(false);
    }
  };

  // Hämta ett testord när inställningarna ändras (i inställningsvyn)
  useEffect(() => {
    if (showSettings) {
      const fetchWord = async () => {
        try {
          console.log("Förhandsgranskar ord med inställningar:", {
            wordLength,
            allowDuplicates,
          });
          const result = await getRandomWord(wordLength, allowDuplicates);

          if (result.error) {
            console.warn("Kunde inte förhandsgranska ord:", result.error);
            setWarning(result.error);
          } else {
            console.log("Förhandsgranskade ordet:", result.word);
            setCurrentWord(result.word);
            setWarning("");
          }
        } catch (error) {
          console.error("Fel vid förhandsgranskning av ord:", error);
          setWarning(
            "Fel vid hämtning av ord: " + (error.message || "Okänt fel")
          );
        }
      };

      fetchWord();
    }
  }, [wordLength, allowDuplicates, showSettings]);

  // Beräkna tid när spelet är över
  useEffect(() => {
    if (gameOver && startTime) {
      const endTime = Date.now();
      setTimeTaken((endTime - startTime) / 1000);
    }
  }, [gameOver, startTime]);

  // Hantera gissning
  const handleGuess = () => {
    if (!currentWord) {
      setWarning("Inget ord har hämtats från servern.");
      return;
    }

    if (input.length !== wordLength) {
      setWarning(`Ordet måste vara ${wordLength} bokstäver långt`);
      return;
    }

    if (gameOver) return;

    setWarning("");
    const feedback = wordle(input, currentWord);
    setGuesses([...guesses, { guess: input, feedback }]);
    setInput("");

    if (input.toLowerCase() === currentWord.toLowerCase()) {
      setGameOver(true);
      setWon(true);
    } else if (guesses.length >= 5) {
      setGameOver(true);
      setWon(false);
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
    startGame();
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
            href='/highscores'
            className='navigation-button highscore-button'
          >
            Highscores
          </a>
          <a
            href='/info'
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
          startGame={startGame}
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
                      {/* Länk till server-side renderad highscore-sida */}
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
                  {/* Länk till server-side renderad highscore-sida */}
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

      {/* Footer */}
      <footer className='game-footer'>
        <p>&copy; 2025 Wordle Game | Utvecklad av Jörgen Lindström</p>
      </footer>
    </div>
  );
}

export default App;
