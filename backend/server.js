import express from "express";
import fs from "fs/promises";
import mongoose from "mongoose";
import { selectWord } from './logic/selectWord.js';
import { Highscore } from './src/models.js';

const app = express();
const PORT = 5080;

// Middleware för att parsa JSON
app.use(express.json());

// Konfigurera EJS som view engine med relativa sökvägar
app.set('view engine', 'ejs');
app.set('views', './views'); // Relativ sökväg till views-mappen

// Statiska filer
app.use(express.static('./public')); // Relativ sökväg till public-mappen

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Anslut till MongoDB
mongoose.connect('mongodb://localhost:27017/wordleGame')
  .then(() => console.log('Ansluten till MongoDB'))
  .catch(err => console.error('MongoDB anslutningsfel:', err));

// API-endpoint för att hämta slumpmässigt ord
app.get('/api/random-word', async (req, res) => {
  try {
    console.log('Mottog förfrågan med parametrar:', req.query);
    
    const length = parseInt(req.query.length) || 5;
    const allowDuplicates = req.query.allowDuplicates === 'true';
    
    console.log('Hämtar ord från fil...');
    const words = await getWordsFromFile();
    
    console.log(`Hittade ${words.length} ord totalt`);
    
    if (!words || words.length === 0) {
      console.log('Inga ord hittades i filen');
      return res.status(404).json({ error: 'Inga ord hittades i databasen' });
    }
    
    console.log('Använder selectWord med parametrar:', { length, allowDuplicates });
    const result = selectWord(words, length, allowDuplicates);
    
    if (result.error) {
      console.log('selectWord returnerade ett fel:', result.error);
      return res.status(404).json({ error: result.error });
    }
    
    console.log('Valt ord:', result.word);
    res.json({ data: result.word });
  } catch (error) {
    console.error('Fel vid hantering av förfrågan:', error);
    res.status(500).json({ error: 'Något gick fel på servern' });
  }
});

// Statisk informationssida om projektet
app.get('/info', (req, res) => {
  try {
    res.render('info', {
      title: 'Om Wordle-projektet'
    });
  } catch (error) {
    console.error('Fel vid rendering av informationssida:', error);
    res.status(500).render('error', {
      error: 'Kunde inte ladda informationssidan',
      message: error.message
    });
  }
});

// API-endpoint för att spara highscore
app.post('/api/highscores', async (req, res) => {
  try {
    console.log('Mottagna highscore-data:', req.body);
    
    const { name, timeTaken, guesses, letters, duplicates } = req.body;
    
    if (!name || typeof timeTaken !== 'number' || typeof guesses !== 'number') {
      return res.status(400).json({ error: 'Ogiltiga data för highscore' });
    }
    
    const newHighscore = new Highscore({
      name,
      timeTaken,
      guesses,
      letters,
      duplicates
    });
    
    await newHighscore.save();
    console.log('Sparad highscore:', newHighscore);
    
    res.status(201).json({ 
      message: 'Highscore sparad!',
      highscore: newHighscore 
    });
  } catch (error) {
    console.error('Fel vid sparande av highscore:', error);
    res.status(500).json({ error: 'Kunde inte spara highscore' });
  }
});

// API-endpoint för att hämta highscores som JSON
app.get('/api/highscores', async (req, res) => {
  try {
    const highscores = await Highscore.find()
      .sort({ guesses: 1, timeTaken: 1 })
      .limit(20);
    
    console.log('Hämtade highscores:', highscores.length);
    res.json({ highscores });
  } catch (error) {
    console.error('Fel vid hämtning av highscores:', error);
    res.status(500).json({ error: 'Kunde inte hämta highscores' });
  }
});

// Server-side renderad highscore-sida
app.get('/highscores', async (req, res) => {
  try {
    // Hämta data från databasen
    const highscores = await Highscore.find()
      .sort({ guesses: 1, timeTaken: 1 })
      .limit(20);
    
    // Hantera formatering på server-sidan
    const formattedHighscores = highscores.map(score => {
      const minutes = Math.floor(score.timeTaken / 60);
      const seconds = Math.floor(score.timeTaken % 60);
      const timeFormatted = `${minutes}m ${seconds}s`;
      
      return {
        ...score.toObject(),
        timeFormatted
      };
    });
    
    // Rendera EJS-templaten med data
    res.render('highscores', { 
      highscores: formattedHighscores,
      title: 'Wordle Highscores',
      currentDate: new Date().toISOString().slice(0, 10)
    });
  } catch (error) {
    console.error('Fel vid server-rendering av highscores:', error);
    res.status(500).render('error', { 
      error: 'Kunde inte ladda highscores',
      message: error.message
    });
  }
});

// Funktion för att hämta ord från fil
async function getWordsFromFile() {
  try {
    const wordsData = await fs.readFile('./words.json', 'utf8');
    const parsedData = JSON.parse(wordsData);
    const words = parsedData.words || [];
    return words;
  } catch (error) {
    console.error('Fel vid läsning av words.json:', error);
    return [];
  }
}

app.get('/', async (req, res) => {
  const htmlText = await fs.readFile('../frontend/dist/index.html', 'utf8');
  res.send(htmlText.toString());
});

app.use('/assets', express.static('../frontend/dist/assets')); // Statiska filer för frontend


const server = app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});