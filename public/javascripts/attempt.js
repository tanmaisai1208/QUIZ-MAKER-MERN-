// window.onload = function () {
//     let currentQuestionIndex = 0;
//     let score = 0;

//     const questions = quiz.questions; 

//     displayQuestion();

//     function displayQuestion() {
//         const questionElements = document.querySelectorAll('.question');

//         // Hide all questions
//         questionElements.forEach(q => q.style.display = 'none');

//         // Show current question
//         questionElements[currentQuestionIndex].style.display = 'block';

//         handleNavigationVisibility();
//     }

//     function handleNavigationVisibility() {
//         document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
//         document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
//     }

//     document.getElementById('next-btn').addEventListener('click', function () {
//         if (currentQuestionIndex < questions.length - 1) {
//             checkAnswer();
//             currentQuestionIndex++;
//             displayQuestion();
//         }
//     });

//     document.getElementById('prev-btn').addEventListener('click', function () {
//         if (currentQuestionIndex > 0) {
//             currentQuestionIndex--;
//             displayQuestion();
//         }
//     });

//     function checkAnswer() {
//         const selectedOption = document.querySelector(`input[name="answer-${currentQuestionIndex}"]:checked`);
//         const question = questions[currentQuestionIndex];

//         if (selectedOption && selectedOption.value === question.options[question.correct]) {
//             score++;
//         }
//     }

//     document.getElementById('submit-btn').addEventListener('click', function () {
//         checkAnswer();
//         displayScore();
//     });

//     function displayScore() {
//         document.getElementById('result-section').classList.remove('result-hidden');
//         document.getElementById('score').innerText = `${score} / ${questions.length}`;
//     }
// };



// window.onload = function () {
//     let currentQuestionIndex = 0;
//     let score = 0;
//     const questions = quiz.questions; 

//     displayQuestion();

//     function displayQuestion() {
//         const questionElements = document.querySelectorAll('.question');

//         // Hide all questions
//         questionElements.forEach(q => {
//             q.style.display = 'none';
//             const options = q.querySelector('.options'); // Get the options container
//             if (options) {
//                 options.style.display = 'none'; // Hide options initially
//             }
//         });

//         // Show current question
//         questionElements[currentQuestionIndex].style.display = 'block';
        
//         // Show the options for the current question
//         const currentOptions = questionElements[currentQuestionIndex].querySelector('.options');
//         if (currentOptions) {
//             currentOptions.style.display = 'block'; // Show options
//         }

//         handleNavigationVisibility();
//     }

//     function handleNavigationVisibility() {
//         document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
//         document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
//         document.getElementById('submit-section').style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
//     }

//     document.getElementById('next-btn').addEventListener('click', function () {
//         if (currentQuestionIndex < questions.length - 1) {
//             checkAnswer();
//             currentQuestionIndex++;
//             displayQuestion();
//         }
//     });

//     document.getElementById('prev-btn').addEventListener('click', function () {
//         if (currentQuestionIndex > 0) {
//             currentQuestionIndex--;
//             displayQuestion();
//         }
//     });

//     function checkAnswer() {
//         const question = questions[currentQuestionIndex];

//         // Handle answer checking based on question type
//         if (question.type === 'multiple-choice') {
//             const selectedOption = document.querySelector(`input[name="answer-${currentQuestionIndex}"]:checked`);
//             if (selectedOption && selectedOption.value === question.options[question.correct]) {
//                 score++;
//             }
//         } else if (question.type === 'open-ended') {
//             const userAnswer = document.querySelector(`textarea[name="answer-${currentQuestionIndex}"]`).value.trim();
//             if (userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
//                 score++;
//             }
//         }
//     }

//     document.getElementById('submit-btn').addEventListener('click', function () {
//         checkAnswer();
//         displayScore();
//     });

//     function displayScore() {
//         document.getElementById('result-section').classList.remove('result-hidden');
//         document.getElementById('score').innerText = `${score} / ${questions.length}`;
//     }
// };


window.onload = function () {
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = quiz.questions; // Assumes 'quiz' is passed from the server
    console.log(questions);
    
    displayQuestion();

    // Function to display the current question
    function displayQuestion() {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = '';  // Clear previous question

        const questionObj = questions[currentQuestionIndex];  // Get current question
        const questionElement = document.createElement('h2');  // Create <h2> for question text
        questionElement.className = 'question';
        questionElement.innerText = `Q${currentQuestionIndex + 1}) ${questionObj.text}`; // Set question text

        questionContainer.appendChild(questionElement);  // Add question to container

        if (questionObj.type === 'multiple' && questionObj.options) {
            // Display multiple choice options
            for (let optionKey in questionObj.options) {
                if (questionObj.options.hasOwnProperty(optionKey)) {
                    const optionValue = questionObj.options[optionKey];

                    const optionElement = document.createElement('label');  // Create label for each option
                    optionElement.className = 'answer-option';
                    optionElement.innerHTML = `
                        <input type="radio" name="answer" value="${optionValue}">
                        ${optionValue}
                    `;
                    questionContainer.appendChild(optionElement);  // Append option to container
                }
            }
        } else {
            // Handle open-ended question
            const openEndedInput = document.createElement('input');  // Create input for open-ended answer
            openEndedInput.type = 'text';
            openEndedInput.name = 'answer';
            openEndedInput.className = 'open';
            openEndedInput.placeholder = 'TYPE YOUR ANSWER';
            questionContainer.appendChild(openEndedInput);  // Append input to container
        }

        // Show the question container and navigation
        document.getElementById('question-container').style.display = 'block';
        document.querySelector('.navigation').style.display = 'block';

        // Handle the display of navigation buttons
        handleNavigationVisibility();
    }

    function handleNavigationVisibility() {
        document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
        document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
        document.getElementById('submit-section').style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
    }

    // Event listeners for navigation buttons
    document.getElementById('next-btn').addEventListener('click', function () {
        checkAnswer();  // Check current answer before moving forward
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
        checkAnswer();  // Check the final answer
        displayScore();  // Show the score
        score=0;

        setTimeout(function() {
            alert('Quiz submitted successfully!');  // Show the alert
            window.location.href = '/takeQuiz';  // Redirect after alert is closed
        }, 2500); 
    });

    // Display the score
    function displayScore() {
        document.getElementById('result-section').classList.remove('result-hidden');
        document.getElementById('score').innerText = `${score} / ${questions.length}`;
    }
};
