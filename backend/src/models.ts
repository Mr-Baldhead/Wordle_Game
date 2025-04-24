import mongoose, { Schema, Document } from "mongoose";

// Definiera ett gränssnitt för modellen
export interface IHighscore extends Document {
  name: string;
  timeTaken: number;
  guesses: number;
  letters: number;
  duplicates: boolean;
}

// Skapa ett schema baserat på gränssnittet
const highscoreSchema: Schema = new Schema<IHighscore>({
  name: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  guesses: { type: Number, required: true },
  letters: { type: Number, required: true },
  duplicates: { type: Boolean, required: true },
});

// Exportera modellen
export const Highscore = mongoose.model<IHighscore>("Highscore", highscoreSchema);