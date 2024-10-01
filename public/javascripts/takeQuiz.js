// Dummy data for the quiz questions (you will replace this with fetched data)
const questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correct: "Paris"
    },
    {
        question: "What is the largest planet in our Solar System?",
        options: ["Earth", "Jupiter", "Saturn", "Mars"],
        correct: "Jupiter"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["O2", "H2O", "CO2", "N2"],
        correct: "H2O"
    }
];

// Variables to track the quiz state
let currentQuestionIndex = 0;
let score = 0;

// Load the first question when the page loads
window.onload = function() {
    displayQuestion();
};

// Function to display the current question
function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const questionObj = questions[currentQuestionIndex];

    const questionElement = document.createElement('h2');
    questionElement.className = 'question';
    questionElement.innerText = questionObj.question;

    questionContainer.appendChild(questionElement);

    questionObj.options.forEach(option => {
        const optionElement = document.createElement('label');
        optionElement.className = 'answer-option';
        optionElement.innerHTML = `
            <input type="radio" name="answer" value="${option}">
            ${option}
        `;
        questionContainer.appendChild(optionElement);
    });
}

// Event listeners for navigation buttons
document.getElementById('next-btn').addEventListener('click', function() {
    checkAnswer();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
});

document.getElementById('prev-btn').addEventListener('click', function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});

// Check the user's selected answer
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        const answer = selectedOption.value;
        if (answer === questions[currentQuestionIndex].correct) {
            score++;
        }
    }
}

// Submit button event listener
document.getElementById('submit-btn').addEventListener('click', function() {
    checkAnswer();
    displayScore();
});

// Display the user's score
function displayScore() {
    document.getElementById('result-section').classList.remove('result-hidden');
    document.getElementById('score').innerText = `${score} / ${questions.length}`;
}
