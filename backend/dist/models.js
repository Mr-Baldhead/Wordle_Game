import mongoose, { Schema } from "mongoose";
// Skapa ett schema baserat på gränssnittet
const highscoreSchema = new Schema({
    name: { type: String, required: true },
    timeTaken: { type: Number, required: true },
    guesses: { type: Number, required: true },
    letters: { type: Number, required: true },
    duplicates: { type: Boolean, required: true },
});
// Exportera modellen
export const Highscore = mongoose.model("Highscore", highscoreSchema);
