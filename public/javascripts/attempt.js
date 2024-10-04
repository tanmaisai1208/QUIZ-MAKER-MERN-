
window.onload = function () {
let currentQuestionIndex = 0;
let score = 0;

const questions = quiz.questions; 

displayQuestion();
function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = ''; 

    const questionObj = questions[currentQuestionIndex];
    const questionElement = document.createElement('h2');
    questionElement.className = 'question';
    questionElement.innerText = questionObj.text;

    questionContainer.appendChild(questionElement);

    if (questionObj.type === 'multiple' && questionObj.options) {
        for (let optionKey in questionObj.options) {
            if (questionObj.options.hasOwnProperty(optionKey)) {
                const optionValue = questionObj.options[optionKey];

                const optionElement = document.createElement('label');
                optionElement.className = 'answer-option';
                optionElement.innerHTML = `
                    <input type="radio" name="answer" value="${optionValue}">
                    ${optionValue}
                `;
                questionContainer.appendChild(optionElement);
            }
        }
    } else {
        const openEndedInput = document.createElement('input');
        openEndedInput.type = 'text';
        openEndedInput.name = 'answer';
        openEndedInput.placeholder = 'Your answer';
        questionContainer.appendChild(openEndedInput);
    }

    handleNavigationVisibility();
}

function handleNavigationVisibility() {
    document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
}

document.getElementById('next-btn').addEventListener('click', function () {
    if (currentQuestionIndex < questions.length - 1) {
        checkAnswer();
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

function checkAnswer() {
    const questionObj = questions[currentQuestionIndex];
    if (questionObj.type === 'multiple') {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption && selectedOption.value === questionObj.correct) {
            score++;
        }
    } else {
        const userAnswer = document.querySelector('input[name="answer"]').value.trim();
        if (userAnswer.toLowerCase() === questionObj.correct.toLowerCase()) {
            score++;
        }
    }
}

document.getElementById('submit-btn').addEventListener('click', function () {
    checkAnswer();
    displayScore();
});

function displayScore() {
    document.getElementById('result-section').classList.remove('result-hidden');
    document.getElementById('score').innerText = `${score} / ${questions.length}`;
}
};