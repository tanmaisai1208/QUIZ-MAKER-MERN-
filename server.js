const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
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
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    console.log("hello");
    try {
        // const { quizTitle, questions } = req.body;
        // const quizData = JSON.parse(req.body.quizData);
        const { quizTitle, questions } = req.body;   
        const newQuiz = new Quiz({    
            quizTitle: quizTitle,
            questions: questions.map(question => {
                if (question.correct) {
                    return {
                        text: question.text,
                        type: 'multiple', 
                        options: {
                            a: question.a,
                            b: question.b,
                            c: question.c,
                            d: question.d
                        },
                        correct: question.correct,
                        answer: null
                    };
                } else {
                    return {
                        text: question.text,
                        type: 'open-ended', 
                        options: null,
                        correct: null,
                        answer: question.answer 
                    };
                }
            }),
        });

        // Save the quiz to the database
        await newQuiz.save();
        res.status(201).json({ message: 'Quiz created successfully!' });
        console.log("successfull");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create quiz.' });
    }
});


app.get('/takeQuiz', async (req, res) => {
    res.render('takeQuiz.ejs');
 });

// Route to get quiz by ID
app.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 800;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
