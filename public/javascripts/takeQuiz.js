document.getElementById('quizTitle').addEventListener('change', async function () {
    const selectedTitle = this.value; 

    try {
        const response = await fetch(`/quiz/urls/${selectedTitle}`);
        
        if (response.ok) {
            const quizUrls = await response.json();
            console.log('Quiz URLs received:', quizUrls);
            const urlContainer = document.getElementById('url-container');
            urlContainer.innerHTML = 'URLs FOR THE SELECTED QUIZ-TITLE ';

            if (quizUrls.length > 0) {
                quizUrls.forEach(url => {
                    const link = document.createElement('a');
                    const quizId = url.split('/').pop();
                    link.href = `/attemptQuiz?quizId=${quizId}`; 
                    link.innerText = url;
                    link.target = '_blank';
                    link.style.display = 'block'; 
                    urlContainer.appendChild(link);
                });
            } else {
                urlContainer.innerHTML = '<p>No quizzes available for this title.</p>';
            }
        } else {
            urlContainer.innerHTML = '<p>Failed to load quiz URLs. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error fetching quiz URLs:', error);
        document.getElementById('url-container').innerHTML = '<p>Error loading quiz URLs.</p>';
    }
});
