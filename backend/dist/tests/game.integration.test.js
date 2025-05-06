var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import supertest from 'supertest';
import { app } from '../src/server';
import mongoose from 'mongoose';
describe('Wordle Game Flow', () => {
    let sessionId;
    let pickedWordLength;
    // Stänger anslutningen till databasen efter testerna se även längst ner i server.ts
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose.connection.close();
    }));
    it('should start a new game session', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield supertest(app)
            .post('/api/game/start')
            .send({ length: 5, allowDuplicates: false });
        expect(res.statusCode).toBe(200);
        expect(res.body.sessionId).toBeDefined();
        expect(res.body.wordLength).toBe(5);
        sessionId = res.body.sessionId;
        pickedWordLength = res.body.wordLength;
    }));
    it('should reject invalid guess (wrong length)', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield supertest(app)
            .post('/api/game/guess')
            .send({ sessionId, guess: 'a' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('måste vara');
    }));
    it('should make a valid guess and receive feedback', () => __awaiter(void 0, void 0, void 0, function* () {
        const guess = 'guess';
        const res = yield supertest(app)
            .post('/api/game/guess')
            .send({ sessionId, guess });
        expect(res.statusCode).toBe(200);
        expect(res.body.feedback).toHaveLength(pickedWordLength);
        expect(res.body.guessCount).toBe(1);
    }));
    it('should end the game and reveal the word', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield supertest(app)
            .post('/api/game/end')
            .send({ sessionId });
        expect(res.statusCode).toBe(200);
        expect(res.body.word).toBeDefined();
        expect(res.body.guessCount).toBeGreaterThan(0);
        expect(res.body.timeTaken).toBeGreaterThan(0);
    }));
    it('should save a highscore', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield supertest(app)
            .post('/api/highscores')
            .send({
            name: 'Testspelare',
            timeTaken: 12.5,
            guesses: 3,
            letters: 5,
            duplicates: false,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.highscore.name).toBe('Testspelare');
    }));
    it('should fetch highscores with filtering', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield supertest(app)
            .get('/highscores')
            .query({ letters: 5, duplicates: 'false' });
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Wordle Highscores');
    }));
});
