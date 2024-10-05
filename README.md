# QUIZ-MAKER-(MERN)
Project for creating a quiz maker using MERN stack (MongoDb, Express.js, React.js, Node.js)

# Quiz Web Application

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Possible Improvements](#possible-improvements)
- [Conclusion](#conclusion)

## Introduction

The Quiz Web Application is an interactive platform that allows users to create and share quizzes, and attempt quizzes created by others. The project includes a full-fledged user authentication system and supports a variety of question formats, including both multiple-choice and open-ended questions.

## Features

- **User Authentication**: Secure login and registration system.
- **Quiz Creation**: Users can create quizzes, add multiple-choice or open-ended  questions, and share quiz links.
- **Quiz Attempting**: Users can select quizzes to attempt and receive feedback on their answers.
- **Dynamic Question Loading**: Questions are dynamically loaded from the database for each quiz.
- **Flexible Question Formats**: Both multiple-choice and open-ended question formats are supported, with multiple data-types such as string,numeric etc.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Other**: Mongoose for MongoDB interactions

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tanmaisai1208/QUIZ-MAKER-MERN-.git

2. Install Dependencies:
   npm install

3. Set up environment variables in a .env file:

   MONGO_URI = mongodb://localhost:27017/newDb
   PORT = 800
   SESSION_SECRET=4b3403665fea6b5d60eddf678e1ce5fba12da6b3a23c62e1e8b6d4e56af5a123

4. Start the application:
   npm start


## Usage

- **Home Page**: Users can access the home page with an introduction to the platform.
- **Login and Registration**: Users can log in or sign up to access quiz creation and participation features.
- **Create Quiz**: Authenticated users can create quizzes using the /createQuiz page.
- **Take Quiz**: Users can attempt quizzes using the /takeQuiz page, and quiz questions are dynamically fetched based on the selected quiz.
- **Attempt Quiz**: Users can see quiz results and view their performance.

## Possible Improvements

- **Result Analytics**: Show detailed quiz results and performance analytics.
- **Question Pool**: Add functionality for users to select random questions from a larger pool.
- **Social Sharing**: Enable social media sharing of quiz results or quizzes.
- **Real-time Quizzes**: Implement real-time quizzes where multiple users can participate simultaneously.

## Conclusion
The Quiz Web Application provides an intuitive interface for creating and attempting quizzes. Future improvements will focus on enhancing user experience and adding more features, such as advanced analytics and real-time quiz participation.