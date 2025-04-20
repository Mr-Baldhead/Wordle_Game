import { selectWord } from './selectWord.js';

describe('Select a proper word', () => {
  
it('Chooses a word of the correct length', () => {
    const words = ['apple', 'banana', 'grape', 'pear'];
    const result = selectWord(words, 5, false);
    expect(result.length).toBe(5);
  });

it('Selects a word from the list', () => {
    const words = ['apple', 'banana', 'grape', 'pear'];
    const result = selectWord(words, 5, false);
    expect(words).toContain(result);
  });

it('Selects only words with unique letters if uniqueLetters is true', () => {
    const words = ['apple', 'mango', 'grape'];
    const result = selectWord(words, 5, true);
    expect(new Set(result).size).toBe(result.length);
  });

it('Allows words with repeated letters if uniqueLetters is false', () => {
    const words = ['apple', 'mango', 'grape'];
    const result = selectWord(words, 5, false);
    expect(result).toBeDefined();
  });

it('Throws an error if no matching word is found', () => {
    const words = [];
    expect(() => selectWord(words, 5, false)).toThrowError('Inget ord matchar kriterierna.');
  });
  
  
it('Chooses different words for repeated calls', () => {
    const words = ['apple', 'mango', 'grape', 'peach'];
    const results = new Set([
      selectWord(words, 5, false),
      selectWord(words, 5, false),
      selectWord(words, 5, false),
    ]);
    expect(results.size).toBeGreaterThan(1);
  });
});
  
  
  
  
  
  
  