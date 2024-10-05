const quizForm = document.getElementById('quizForm');
const questionsContainer = document.getElementById('questionsContainer');
let questionCount = 0;

document.getElementById('addQuestionBtn').addEventListener('click', () => {
    questionCount++;
    
    let questionHTML = `
        <div class="question">
            <label for="questionText">Question ${questionCount}:</label>
            <input type="text" class="questionText" name="questionText" required><br>

            <!-- Question Type Selection -->
            <label for="questionType">Question Type:</label>
            <select class="questionType" name="questionType" onchange="toggleOptions(this)">
                <option value="multiple">Multiple Choice</option>
                <option value="open-ended">Open-ended</option>
            </select><br>

            <!-- Multiple Choice Options -->
            <div class="multipleChoiceOptions">
                <label>Option A:</label><input type="text" class="optionA" name="optionA" required><br>
                <label>Option B:</label><input type="text" class="optionB" name="optionB" required><br>
                <label>Option C:</label><input type="text" class="optionC" name="optionC" required><br>
                <label>Option D:</label><input type="text" class="optionD" name="optionD" required><br>
                <label>Correct Answer:</label>
                <select class="correctOption" name="correctOption" required>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                </select>
            </div>

            <!-- Open-ended Answer Input (Hidden by default) -->
            <div class="openEndedAnswer" style="display:none;">
                <label for="openEndedAnswer">Answer:</label>
                <input type="text" class="openEndedInput" name="openEndedAnswer" placeholder="Type the correct answer"><br>
            </div>
        </div>
    `;
    questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
});

function toggleOptions(select) {
    const questionDiv = select.closest('.question');
    const multipleChoiceOptions = questionDiv.querySelector('.multipleChoiceOptions');
    const openEndedAnswer = questionDiv.querySelector('.openEndedAnswer');

    if (select.value === 'multiple') {
        multipleChoiceOptions.style.display = 'block';
        openEndedAnswer.style.display = 'none';
        questionDiv.querySelector('.openEndedInput').removeAttribute('required');
        questionDiv.querySelectorAll('.optionA, .optionB, .optionC, .optionD, .correctOption').forEach(input => {
            input.setAttribute('required', 'required');
        });
    } else {
        multipleChoiceOptions.style.display = 'none';
        openEndedAnswer.style.display = 'block';
        questionDiv.querySelector('.openEndedInput').setAttribute('required', 'required');
        questionDiv.querySelectorAll('.optionA, .optionB, .optionC, .optionD, .correctOption').forEach(input => {
            input.removeAttribute('required');
        });
    }
}

quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const quizData = {
        quizTitle: document.getElementById('quizTitle').value,
        questions: []
    };

    const questions = document.getElementsByClassName('question');
    Array.from(questions).forEach((question) => {
        const text = question.querySelector('.questionText').value;
        const questionType = question.querySelector('.correctOption') ? 'multiple' : 'open-ended';

        if (questionType === 'multiple') {
            const options = {
                a: question.querySelector('.optionA').value,
                b: question.querySelector('.optionB').value,
                c: question.querySelector('.optionC').value,
                d: question.querySelector('.optionD').value
            };
            const correct = question.querySelector('.correctOption').value;
            quizData.questions.push({ text, type: 'multiple', options, correct });
        } else {
            const answer = question.querySelector('.openEndedInput').value;
            quizData.questions.push({ text, type: 'open-ended', answer });
        }
    });

    const response = await fetch('/createQuiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    });

    // const result = await response.json();
    // if (response.ok) {
    //     alert(`Quiz created successfully! Share this URL: ${result.quizUrl}`);
    // } else {
    //     alert(`Failed to create quiz: ${result.message}`);
    // }
                // const result = await response.json();
    if (response.ok) {
        alert('Quiz created successfully!');
        const {quizId}  = await response.json();  
        const quizUrl = `${quizId}`;  
        console.log(quizUrl); 
        const container = document.getElementById('quiz-url-container');
        
        const link = document.createElement('a');
        link.className = 'url';
        const Id = quizId.split('/').pop();
        link.href = `/attemptQuiz?quizId=${Id}`; 
        link.innerText = quizUrl;
        link.target = '_blank';
        link.style.display = 'block'; 
        container.appendChild(link);
        document.getElementById('quiz-url-container').style.display = 'block';
    } else {
        alert('Failed to create quiz.');
    }
});