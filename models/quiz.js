const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizTitle: { type: String, required: true },
    questions: [
        {
            text: { type: String, required: true },
            type: { type: String, enum: ['multiple', 'open-ended'], required: true },
            options: {
                a: { type: String },
                b: { type: String },
                c: { type: String },
                d: { type: String },
            },
            correct: { type: String }, 
            answer: { type: String }
        },
    ],
    // url: { type: String, required: true },
});

module.exports = new mongoose.model('Quiz', quizSchema);