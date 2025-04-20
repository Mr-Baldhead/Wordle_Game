import mongoose from "mongoose";

const highscoreSchema = new mongoose.Schema({
    name: String,
    timeTaken: Number,
    guesses: Number,
    letters: Number,
    duplicates: Boolean,
});
const Highscore = mongoose.model("Highscore", highscoreSchema);

export { Highscore };


//Datatyp
// const taskSchema = new mongoose.Schema({
//     label: String,
//     completed: Boolean
// });

// //model
// const Task = mongoose.model("Task", taskSchema);
// //export
// export {Task};

//To code
// const tasks = await Task.find();