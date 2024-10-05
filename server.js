const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Quiz = require('./models/quiz');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Error connecting to MongoDB: ", err));

app.set('view-engine','ejs');
app.set('views','views');
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure:  process.env.NODE_ENV === 'production' } 
}));

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        req.session.auth = 'You havent logged in yet, Please Login first';
        return res.redirect('/login');
    }
    next()
}

app.get('/', async (req, res) => {
    const successfull = req.session.successfull;
    delete req.session.successfull;
    res.render('home.ejs', {successfull: successfull, userId: req.session.userId});
});

app.get('/login', async (req, res) => {
    const success = req.session.success;
    delete req.session.success;
    const incorrect = req.session.incorrect;
    delete req.session.incorrect;
    const auth = req.session.auth;
    delete req.session.auth;
    const logout = req.session.logout;
    delete req.session.logout;
    res.render('login.ejs', { success: success, incorrect: incorrect, auth: auth, logout: logout });
});

app.get('/register', async (req, res) => {
    const already = req.session.already;
    delete req.session.already;
    const not_found = req.session.not_found;
    delete req.session.not_found;
    res.render('register.ejs', { already: already, not_found: not_found });
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.session.already = 'USER ALREADY EXISTS WITH THAT EMAIL';
            return res.redirect('/register');
        }
        else {
            const newUser = new User({
                name,
                email,
                password
            });
            await newUser.save();
            req.session.userId = newUser._id;
            req.session.success = 'REGISTERED SUCCESSFULLY';
            return res.redirect('/login');
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.session.not_found = 'NO USER WITH THAT EMAIL, PLEASE REGISTER FIRST'
            return res.redirect('/register');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.incorrect = 'INCORRECT PASSWORD';
            return res.redirect('/login');
        } else {
            req.session.userId = user._id;
            req.session.successfull = 'LOGGED-IN SUCCESSFULLY';
            console.log("logged-in");
            return res.redirect('/');
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/logout', (req, res) => {
   res.render('logout.ejs');
});

app.post('/logout', (req, res) => {
    req.session.userId = null;
    req.session.logout = 'LOGGED OUT';
    res.redirect('/login');
});

app.get('/createQuiz', async (req, res) => {
   res.render('createQuiz.ejs');
});

app.post('/createQuiz', async (req, res) => {
    try {
        const { quizTitle, questions } = req.body;

        if (!questions || questions.length === 0) {
            return res.status(400).json({ message: 'Quiz must contain at least one question.' });
        }   

        const newQuiz = new Quiz({    
            quizTitle: quizTitle,
            questions: questions.map(question => {
                if (question.correct) {
                    return {
                        text: question.text,
                        type: 'multiple', 
                        options: {
                            a: question.options.a,
                            b: question.options.b,
                            c: question.options.c,
                            d: question.options.d
                        },
                        correct: question.correct,
                        answer: null
                    };
                } else {
                    return {
                        text: question.text,
                        type: 'open-ended', 
                        options: {
                            a: null, 
                            b: null,
                            c: null,
                            d: null
                        },
                        correct: null,
                        answer: question.answer 
                    };
                }
            }),
            // url: quizUrl,
        });
        
        await newQuiz.save();
        const quizId = newQuiz._id;
        const quizUrl = `https://QuizMaster/quiz/attempt/${quizId}`;
        res.status(201).json({ message: 'Quiz created successfully!', quizId: quizUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create quiz.' });
    }
});


app.get('/takeQuiz', async (req, res) => {
    res.render('takeQuiz.ejs');
 });
                            
app.get('/quiz/urls/:title', async (req, res) => {
    const { title } = req.params;                            
    try {
        const quizzes = await Quiz.aggregate([
            { $match: { quizTitle: title } }, 
            { $sample: { size: 5 } }            
        ]);
        const quizUrls = quizzes.map(quiz => `https://QuizMaster/quiz/attempt/${quiz._id}`); 
        res.json(quizUrls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz URLs.' });
    }
});
                            
app.get('/attemptQuiz', async (req, res) => {
    const { quizId } = req.query; 
    try {
        const quiz = await Quiz.findById(quizId); 
        if (quiz) {
            console.log('Fetched Quiz:', JSON.stringify(quiz)); 
            res.render('attempt.ejs', { quiz }); 
        } else {
            res.status(404).send('Quiz not found.'); 
        }
    } catch (error) {
        console.error('Error fetching quiz:', error); 
        res.status(500).send('Server error while fetching quiz.'); 
    }
});

const PORT = process.env.PORT || 800;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
