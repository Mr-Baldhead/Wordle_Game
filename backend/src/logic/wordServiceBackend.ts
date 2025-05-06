
import fs from 'fs/promises';
import selectWord, { SelectWordResult } from './selectWord';

async function loadWords(): Promise<string[]> {
  const data = await fs.readFile('./words.json', 'utf8');
  const parsedData = JSON.parse(data);
  return parsedData.words || [];
}

export const wordService = {
  async getRandomWord(length: number = 5, allowDuplicates: boolean = false): Promise<SelectWordResult> {
    const words = await loadWords(); // Ladda ordlistan
    return selectWord(words, length, allowDuplicates);
  },

  async getWordsByLength(length: number = 5, allowDuplicates: boolean = false): Promise<boolean> {
    const words = await loadWords(); // Ladda ordlistan
    const result = selectWord(words, length, allowDuplicates);
    return result && !result.error;
  }
};