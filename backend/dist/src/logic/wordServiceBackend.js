var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs/promises';
import selectWord from './selectWord';
function loadWords() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs.readFile('./words.json', 'utf8');
        const parsedData = JSON.parse(data);
        return parsedData.words || [];
    });
}
export const wordService = {
    getRandomWord() {
        return __awaiter(this, arguments, void 0, function* (length = 5, allowDuplicates = false) {
            const words = yield loadWords(); // Ladda ordlistan
            return selectWord(words, length, allowDuplicates);
        });
    },
    getWordsByLength() {
        return __awaiter(this, arguments, void 0, function* (length = 5, allowDuplicates = false) {
            const words = yield loadWords(); // Ladda ordlistan
            const result = selectWord(words, length, allowDuplicates);
            return result && !result.error;
        });
    }
};
