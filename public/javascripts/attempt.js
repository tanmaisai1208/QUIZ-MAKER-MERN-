window.onload = function () {
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = quiz.questions; 
    console.log(questions);
    
    displayQuestion();

    // Function to display the current question
    function displayQuestion() {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = '';  

        const questionObj = questions[currentQuestionIndex];  
        const questionElement = document.createElement('h2');  
        questionElement.className = 'question';
        questionElement.innerText = `Q${currentQuestionIndex + 1}) ${questionObj.text}`; 

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
            openEndedInput.className = 'open';
            openEndedInput.placeholder = 'TYPE YOUR ANSWER';
            questionContainer.appendChild(openEndedInput);  
        }

        document.getElementById('question-container').style.display = 'block';
        document.querySelector('.navigation').style.display = 'block';

        handleNavigationVisibility();
    }

    function handleNavigationVisibility() {
        document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
        document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
        document.getElementById('submit-section').style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
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

    // Check the user's selected answers
    function checkAnswer() {
        const question = questions[currentQuestionIndex];

        if (question.type === 'multiple') {
            const selectedOption = document.querySelector('input[name="answer"]:checked');
            if (selectedOption && selectedOption.value === question.options[question.correct]) {
                score++;
            }
        } else if (question.type === 'open-ended') {
            const userAnswer = document.querySelector('input[name="answer"]').value.trim();
            if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
                score++;
            }
        }
    }

    // Handle submit button click
    document.getElementById('submit-btn').addEventListener('click', function () {
        checkAnswer(); 
        displayScore();  
        score=0;

        setTimeout(function() {
            alert('Quiz submitted successfully!');  
            window.location.href = '/takeQuiz';  
        }, 2500); 
    });

    // Displaying score
    function displayScore() {
        document.getElementById('result-section').classList.remove('result-hidden');
        document.getElementById('score').innerText = `${score} / ${questions.length}`;
    }
};
