const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizTitle: { type: String, required: true },
    questions: [
        {
            text: { type: String, required: true },
            type: { type: String, enum: ['multiple', 'open-ended'], required: true }, // Added type for question type
            options: {
                a: { type: String },
                b: { type: String },
                c: { type: String },
                d: { type: String },
            },
            correct: { type: String }, // This can be optional for open-ended questions
        },
    ],
});

module.exports = new mongoose.model('Quiz', quizSchema);