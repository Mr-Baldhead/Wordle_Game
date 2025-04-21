import { wordle } from './wordle.js';


describe('Wordle algoritmtester', () => {

// Kontrollera att alla bokstäver returneras som 'correct' när gissningen är exakt samma som lösningen
  it('Helt korrekt ord', () => {
    expect(wordle('SMART', 'SMART')).toEqual([
      'correct', 'correct', 'correct', 'correct', 'correct'
    ]);
  });

  //Kontrollera att alla bokstäver returneras som 'incorrect' när ingen bokstav i gissningen finns i lösningen.
  it('Felaktigt ord, ingen match', () => {
    expect(wordle('PLUTO', 'SMAKA')).toEqual([
      'incorrect', 'incorrect', 'incorrect', 'incorrect', 'incorrect'
    ]);
  });

  //Testa en gissning där vissa bokstäver är på rätt plats (correct), medan andra saknas i lösningen (incorrect).
  it('Några korrekta bokstäver på rätt plats', () => {
    expect(wordle('START', 'SMAKA')).toEqual([
      'correct', 'incorrect', 'correct', 'incorrect', 'incorrect'
    ]);
  });

  //Kontrollera att bokstäver som finns i lösningen men på fel plats markeras som 'misplaced'.
  it('Bokstäver på fel plats', () => {
    expect(wordle('TRAMS', 'SMART')).toEqual([
      'misplaced', 'misplaced', 'correct', 'misplaced', 'misplaced'
    ]);
  });

  //Kontrollera att funktionen kan hantera en mix av 'correct', 'misplaced' och 'incorrect' på ett korrekt sätt.
  it('Blandning av korrekt, misplaced och incorrect', () => {
    expect(wordle('STORM', 'SMART')).toEqual([
      'correct', 'misplaced', 'incorrect', 'correct', 'misplaced'
    ]);
  });

  //Kontrollera att algoritmen kan hanterar situationen där en bokstav förekommer flera gånger i gissningen men bara en gång i lösningen.
  it('Dubbel bokstav i gissning, en i lösningen', () => {
    expect(wordle('APPLE', 'PLANE')).toEqual([
      'misplaced', 'misplaced', 'incorrect', 'misplaced', 'correct'
    ]);
  });

});
