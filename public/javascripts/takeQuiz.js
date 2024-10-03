let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Fetch the questions based on the selected quiz title
// async function fetchQuizQuestions(quizTitle) {
//     try {
//         const response = await fetch(`/getQuizQuestions?title=${quizTitle}`);
//         if (response.ok) {
//             questions = await response.json();
//             displayQuestion();
//             document.getElementById('question-container').style.display = 'block';
//             document.querySelector('.navigation').style.display = 'block';
//             document.getElementById('submit-section').style.display = 'block';
//         } else {
//             alert('Failed to load questions.');
//         }
//     } catch (error) {
//         console.error('Error fetching quiz questions:', error);
//     }
// }

async function fetchQuizQuestions(quizTitle) {
    try {
        const response = await fetch(`/getQuizQuestions?title=${quizTitle}`);
        
        if (response.ok) {
            questions = await response.json();

            if (questions.length > 0) {
                displayQuestion();
                document.getElementById('question-container').style.display = 'block';
                document.querySelector('.navigation').style.display = 'block';
                document.getElementById('submit-section').style.display = 'block';
            } else {
                alert('No questions available for this quiz.');
            }
        } else {
            alert('Failed to load questions.');
        }
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
    }
}

// Function to display the current question
// function displayQuestion() {
//     const questionContainer = document.getElementById('question-container');
//     questionContainer.innerHTML = '';

//     const questionObj = questions[currentQuestionIndex];
//     const questionElement = document.createElement('h2');
//     questionElement.className = 'question';
//     questionElement.innerText = questionObj.text;

//     questionContainer.appendChild(questionElement);

//     if (questionObj.type === 'multiple') {
//         questionObj.options.forEach(option => {
//             const optionElement = document.createElement('label');
//             optionElement.className = 'answer-option';
//             optionElement.innerHTML = `
//                 <input type="radio" name="answer" value="${option}">
//                 ${option}
//             `;
//             questionContainer.appendChild(optionElement);
//         });
//     } else {
//         const openEndedInput = document.createElement('input');
//         openEndedInput.type = 'text';
//         openEndedInput.name = 'answer';
//         openEndedInput.placeholder = 'Your answer';
//         questionContainer.appendChild(openEndedInput);
//     }
// }

function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';  // Clear previous question

    const questionObj = questions[currentQuestionIndex];  // Get the current question
    const questionElement = document.createElement('h2');  // Create a <h2> element for the question text
    questionElement.className = 'question';
    questionElement.innerText = questionObj.text;  // Set the question text

    questionContainer.appendChild(questionElement);  // Append the question to the container

    if (questionObj.type === 'multiple' && questionObj.options) {
        for (let optionKey in questionObj.options) {
            if (questionObj.options.hasOwnProperty(optionKey) && questionObj.options[optionKey]) {
                const optionValue = questionObj.options[optionKey];

                const optionElement = document.createElement('label');  // Create a label for each option
                optionElement.className = 'answer-option';
                optionElement.innerHTML = `
                    <input type="radio" name="answer" value="${optionValue}">
                    ${optionValue}
                `;
                questionContainer.appendChild(optionElement);  // Append the option to the container
            }
        }
    } else {
        // Handle open-ended question
        const openEndedInput = document.createElement('input');  // Create an input for open-ended answers
        openEndedInput.type = 'text';
        openEndedInput.name = 'answer';
        openEndedInput.placeholder = 'Your answer';
        questionContainer.appendChild(openEndedInput);  // Append the input to the container
    }
}

// Event listeners for navigation buttons
document.getElementById('next-btn').addEventListener('click', function () {
    checkAnswer();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
});

document.getElementById('prev-btn').addEventListener('click', function () {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});

// Check the user's selected answer
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const userAnswer = selectedOption ? selectedOption.value : document.querySelector('input[name="answer"]').value;
    if (userAnswer === questions[currentQuestionIndex].correct) {
        score++;
    }
}

// Submit button event listener
document.getElementById('submit-btn').addEventListener('click', function () {
    checkAnswer();
    displayScore();
});

// Display the user's score
function displayScore() {
    document.getElementById('result-section').classList.remove('result-hidden');
    document.getElementById('score').innerText = `${score} / ${questions.length}`;
}

// Fetch questions when quiz title is selected
document.getElementById('quizTitle').addEventListener('change', function () {
    const quizTitle = this.value;
    fetchQuizQuestions(quizTitle);
});
