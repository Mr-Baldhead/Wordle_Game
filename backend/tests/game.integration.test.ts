
import supertest from 'supertest';
import { app } from '../src/server';
import mongoose from 'mongoose';

describe('Wordle Game Flow', () => {
  let sessionId: string;
  let pickedWordLength: number;

// Stänger anslutningen till databasen efter testerna se även längst ner i server.ts
  afterAll(async () => { 
    await mongoose.connection.close();
  });

it('should start a new game session', async () => {
  const res = await supertest(app)
    .post('/api/game/start')
    .send({ length: 5, allowDuplicates: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.wordLength).toBe(5);

    sessionId = res.body.sessionId;
    pickedWordLength = res.body.wordLength;
});

  it('should reject invalid guess (wrong length)', async () => {
    const res = await supertest(app)
      .post('/api/game/guess')
      .send({ sessionId, guess: 'a' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('måste vara');
  });

  it('should make a valid guess and receive feedback', async () => {
    const guess = 'guess';
    const res = await supertest(app)
      .post('/api/game/guess')
      .send({ sessionId, guess });

    expect(res.statusCode).toBe(200);
    expect(res.body.feedback).toHaveLength(pickedWordLength);
    expect(res.body.guessCount).toBe(1);
  });

  it('should end the game and reveal the word', async () => {
    const res = await supertest(app)
      .post('/api/game/end')
      .send({ sessionId });

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toBeDefined();
    expect(res.body.guessCount).toBeGreaterThan(0);
    expect(res.body.timeTaken).toBeGreaterThan(0);
  });

  it('should save a highscore', async () => {
    const res = await supertest(app)
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
    });

  it('should fetch highscores with filtering', async () => {
    const res = await supertest(app)
      .get('/highscores')
      .query({ letters: 5, duplicates: 'false' });

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Wordle Highscores');
  });
});
