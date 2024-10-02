const quizForm = document.getElementById('quizForm');
const questionsContainer = document.getElementById('questionsContainer');
let questionCount = 0;

document.getElementById('addQuestionBtn').addEventListener('click', () => {
    questionCount++;
    
    // Prompt for question type
    const questionType = prompt('Enter question type (multiple or open-ended):').toLowerCase();
    
    let questionHTML = `
        <div class="question">
            <label for="questionText">Question ${questionCount+1}:</label>
            <input type="text" class="questionText" name="questionText" required><br>
    `;
    
    if (questionType === 'multiple') {
        questionHTML += `
            <label>Option A:</label><input type="text" class="optionA" required><br>
            <label>Option B:</label><input type="text" class="optionB" required><br>
            <label>Option C:</label><input type="text" class="optionC" required><br>
            <label>Option D:</label><input type="text" class="optionD" required><br>
            <label>Correct Answer:</label>
            <select class="correctOption">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
            </select>
        `;
    } else if (questionType === 'open-ended') {
        questionHTML += `
            <label>Open-Ended Answer:</label><input type="text" class="openEndedAnswer" required><br>
        `;
    } else {
        questionCount--;
        alert('Invalid question type. Please enter "multiple" or "open-ended".');
        return; 
    }
    
    questionHTML += '</div>';
    questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
});

document.getElementById('quizForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const quizData = {
        quizTitle: document.getElementById('quizTitle').value,
        questions: []
    };
    const questions = document.getElementsByClassName('question');
    Array.from(questions).forEach((question) => {
        const text = question.querySelector('.questionText').value;
        
        // Determine if the question is multiple choice or open-ended
        const questionType = question.querySelector('.questionType').value; 
        
        if (questionType === 'multiple') {
            // Multiple choice question
            const a = question.querySelector('.optionA').value;
            const b = question.querySelector('.optionB').value;
            const c = question.querySelector('.optionC').value;
            const d = question.querySelector('.optionD').value;
            const correct = question.querySelector('.correctOption').value;
            quizData.questions.push({ text, a, b, c, d, correct });
        } else {
            // Open-ended question
            const answer = question.querySelector('.openEndedInput').value; 
            quizData.questions.push({ text, answer });
        }
    });

    const response = await fetch('/createQuiz', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData), 
    });

    if (response.ok) {
        alert('Quiz created successfully!');
    } else {
        alert('Failed to create quiz.');
    }
});
