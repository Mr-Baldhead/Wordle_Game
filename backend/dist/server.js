var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import fs from "fs/promises";
import mongoose from "mongoose";
import selectWord from './logic/selectWord.js';
import { gameManager } from './logic/gameManager.js';
import { Highscore } from './models.js';
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
app.get('/api/random-word', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const length = parseInt(req.query.length) || 5;
        const allowDuplicates = req.query.allowDuplicates === 'true';
        const words = yield getWordsFromFile();
        if (!words || words.length === 0) {
            res.status(404).json({ error: 'Inga ord hittades i databasen' });
            return;
        }
        const result = selectWord(words, length, allowDuplicates);
        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }
        res.json({ data: result.word });
    }
    catch (error) {
        console.error('Fel vid hantering av förfrågan:', error);
        res.status(500).json({ error: 'Något gick fel på servern' });
    }
}));
// Starta ett nytt spel
app.post('/api/game/start', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { length = 5, allowDuplicates = false } = req.body;
        const words = yield getWordsFromFile();
        const result = selectWord(words, parseInt(length), allowDuplicates === true);
        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }
        if (!result.word) {
            res.status(400).json({ error: 'Ogiltigt ord genererat' });
            return;
        }
        const session = gameManager.createSession(result.word);
        res.json({
            sessionId: session.sessionId,
            wordLength: session.wordLength
        });
    }
    catch (error) {
        console.error('Fel vid start av spel:', error);
        res.status(500).json({ error: 'Kunde inte starta spelet' });
    }
}));
// Hantera en gissning
app.post('/api/game/guess', (req, res) => {
    try {
        const { sessionId, guess } = req.body;
        if (!sessionId || !guess) {
            res.status(400).json({ error: 'Både sessionId och en gissning krävs' });
            return;
        }
        const result = gameManager.makeGuess(sessionId, guess.toLowerCase());
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result);
    }
    catch (error) {
        console.error('Fel vid hantering av gissning:', error);
        res.status(500).json({ error: 'Kunde inte hantera gissningen' });
    }
});
// Ge upp spelet
app.post('/api/game/end', (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(400).json({ error: 'SessionId krävs' });
            return;
        }
        const result = gameManager.endGame(sessionId);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result);
    }
    catch (error) {
        console.error('Fel vid avslut av spel:', error);
        res.status(500).json({ error: 'Kunde inte avsluta spelet' });
    }
});
// Statisk informationssida om projektet
app.get('/info', (req, res) => {
    try {
        res.render('info', {
            title: 'Om Wordle-projektet'
        });
    }
    catch (error) {
        console.error('Fel vid rendering av informationssida:', error);
        res.status(500).render('error', {
            error: 'Kunde inte ladda informationssidan',
            message: error instanceof Error ? error.message : 'Okänt fel'
        });
    }
});
// API-endpoint för att spara highscore
app.post('/api/highscores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, timeTaken, guesses, letters, duplicates } = req.body;
        if (!name || typeof timeTaken !== 'number' || typeof guesses !== 'number') {
            res.status(400).json({ error: 'Ogiltiga data för highscore' });
            return;
        }
        const newHighscore = new Highscore({
            name,
            timeTaken,
            guesses,
            letters,
            duplicates
        });
        yield newHighscore.save();
        res.status(201).json({
            message: 'Highscore sparad!',
            highscore: newHighscore
        });
    }
    catch (error) {
        console.error('Fel vid sparande av highscore:', error);
        res.status(500).json({ error: 'Kunde inte spara highscore' });
    }
}));
app.get('/highscores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Läs filter från query-parametrar
        const lettersFilter = req.query.letters ? parseInt(req.query.letters) : null;
        const duplicatesFilter = req.query.duplicates === 'true' ? true : req.query.duplicates === 'false' ? false : null;
        // Bygg databasanropet baserat på filter
        let query = Highscore.find();
        if (lettersFilter) {
            query = query.where('letters').equals(lettersFilter); // Filtrera efter antalet bokstäver
        }
        if (duplicatesFilter !== null) {
            query = query.where('duplicates').equals(duplicatesFilter); // Filtrera efter dubbletter
        }
        // Hämta data från databasen
        const highscores = yield query
            .sort({ guesses: 1, timeTaken: 1 })
            .limit(20);
        // Definiera filteralternativ
        const filterOptions = {
            lengths: [4, 5, 6, 7, 8], // Exempelvärden
        };
        // Nuvarande filter
        const currentFilters = {
            letters: req.query.letters || '', // Skicka valt filter tillbaka till formuläret
            duplicates: duplicatesFilter, // Skicka valt dubbletter-filter tillbaka
        };
        // Rendera EJS-templaten med data
        res.render('highscores', {
            highscores,
            title: 'Wordle Highscores',
            currentDate: new Date().toISOString().slice(0, 10),
            filterOptions,
            currentFilters,
        });
    }
    catch (error) {
        console.error('Fel vid server-rendering av highscores:', error);
        // Rendera en felvy om något går fel
        res.status(500).render('error', {
            error: 'Kunde inte ladda highscores',
            message: error instanceof Error ? error.message : 'Okänt fel',
        });
    }
}));
// Funktion för att hämta ord från fil
function getWordsFromFile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const wordsData = yield fs.readFile('./words.json', 'utf8');
            const parsedData = JSON.parse(wordsData);
            return parsedData.words || [];
        }
        catch (error) {
            console.error('Fel vid läsning av words.json:', error);
            return [];
        }
    });
}
// Starta servern
app.listen(PORT, () => {
    console.log(`Server körs på http://localhost:${PORT}`);
});
