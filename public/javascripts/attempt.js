window.onload = function () {
    let currentQuestionIndex = 0;
    let score = 0;

    const questions = quiz.questions; 

    displayQuestion();

    function displayQuestion() {
        const questionElements = document.querySelectorAll('.question');

        // Hide all questions
        questionElements.forEach(q => q.style.display = 'none');

        // Show current question
        questionElements[currentQuestionIndex].style.display = 'block';

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
        const selectedOption = document.querySelector(`input[name="answer-${currentQuestionIndex}"]:checked`);
        const question = questions[currentQuestionIndex];

        if (selectedOption && selectedOption.value === question.options[question.correct]) {
            score++;
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