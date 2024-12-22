
document.getElementById('admin-dash').addEventListener('click', function() {
    // Redirect to the admin login page
    window.location.href = 'admin-dashboard.html'; // Change the path if the file is in a different location
  });
  
  document.addEventListener('contextmenu', (e) => e.preventDefault());  // Disable right-click
  document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
    e.preventDefault();  // Disable copy, paste, and cut actions
  }
});

    // Login Logic
    const loginBtn = document.getElementById('login-btn');
    const loginPage = document.getElementById('login-page');
    const instructionPage = document.getElementById('instruction-page');
    const quizPage = document.getElementById('quiz-page');
    const resultCard = document.getElementById('result-card');
    const exitBtn = document.getElementById('exit-btn')

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionContainer = document.getElementById('question-container');
    const optionContainer = document.getElementById('option-container');
    const currentQuestionElem = document.getElementById('current-question');
    const totalQuestionsElem = document.getElementById('total-questions');

    const totalQuestion = document.querySelector(".total-questions");
    const totalScore = document.querySelector(".total-score .value");
    const yourScore = document.querySelector(".user-score .value");
    const unattempted = document.querySelector(".unattempted .value");
    const attempted = document.querySelector(".attempted .value");
    const wrong = document.querySelector(".wrong .value");
    const nxtBtn = document.querySelector(".btn button");
    let timePerQuestion=10;
    let countdown;

    
    let questions;  // Declare the questions variable

    // Function to fetch questions from the backend
    async function fetchQuestions() {
      try {
        const response = await fetch('https://mini-project-quiz-backend.onrender.com/get-questions');
        const data = await response.json();
        return data;  // Return the fetched data
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    // Function to fetch and use the questions after ensuring fetch is done
    async function loadQuestions() {
      questions = await fetchQuestions();  // Wait for the fetch to complete
      console.log('Fetched questions:', questions);  // Now, you can use the fetched questions

      // Simulate using questions after some time
      setTimeout(() => {
        // console.log('Using questions later:', questions);  // This will work because questions is now populated
      }, 3000);  // 3 seconds later
    }

    // Call the loadQuestions function
    loadQuestions();

    
    
    let currentQuestionIndex = 0;
    let score = 0;
    let attemptQuestion = 0,
        unattemptedQuestion = 0,
        wrongQuestion = 0;

    // Login Event
    loginBtn.addEventListener('click', () => {
      const userId = document.getElementById('user-id').value;
      const password = document.getElementById('password').value;

      if ((userId === '123'||'100210150'||'100210103') && password === 'quiz') {
        console.log("Login successful");
        loginPage.style.display = 'none';
        instructionPage.style.display = 'block'; // Show instruction section
      } else {
        alert('Invalid User ID or Password');
      }
    });

    // Start Quiz Event
    startQuizBtn.addEventListener('click', () => {
      console.log("Start Quiz button clicked");
      instructionPage.style.display = 'none';
      quizPage.style.display = 'block';
      loadQuestion();
    });

    // Load Question and Options
    function loadQuestion() {
        startTimer();
      const currentQuestion = questions[currentQuestionIndex];
      questionContainer.innerHTML = currentQuestion.question;
      optionContainer.innerHTML = '';
      currentQuestion.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.textContent = option;
        optionBtn.onclick = () => checkAnswer(index);
        optionContainer.appendChild(optionBtn);
      });

      currentQuestionElem.textContent = currentQuestionIndex + 1;
      totalQuestionsElem.textContent = questions.length;
    }

    // Check Answer
    function checkAnswer(selectedIndex) {
      const currentQuestion = questions[currentQuestionIndex];
      if (selectedIndex === currentQuestion.correct) {
        score++;
        attemptQuestion++;
      }
      else{
        attemptQuestion++;
        wrongQuestion++;
      }

      // Move to next question
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        showResult();
      }
    }


    function nextQuestion() {
    // Move to next question
    currentQuestionIndex++;
    unattemptedQuestion++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        showResult();
      }
}




function startTimer() {
  
  let timerElement = document.querySelectorAll(".Timer p")[1];
  let timeLeft = timePerQuestion;  // Start the timer from the initial value

  // Stop any previous countdown if it's still running
  if (countdown) {
    clearInterval(countdown);
  }

  // Start the countdown
  countdown = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;  // Decrement the timer
      timerElement.textContent = timeLeft;  // Update the timer display
    } else {
      clearInterval(countdown);  // Stop the countdown
      nextQuestion();

    }
  }, 1000);  // Update every second (1000 ms)
  
}


nxtBtn.addEventListener("click",nextQuestion);
currentQuestionElem.innerHTML=currentQuestionIndex + 1

let isScoreSaved = false;
    // Show Results
    function showResult() {
        quizPage.style.display = 'none';
        resultCard.style.display = 'block';
        totalScore.innerHTML = questions.length
        yourScore.innerHTML = score
        attempted.innerHTML = attemptQuestion
        unattempted.innerHTML = unattemptedQuestion
        wrong.innerHTML = wrongQuestion
        clearInterval(countdown);  // Stop the countdown
        
        if(!isScoreSaved){
        saveScore(document.getElementById('user-id').value,score)
      } 
    }

    // Function to save score to the backend
    function saveScore(user,marks) {
  const dataToSend = {
    username: user,  // Replace with the actual username
    score: marks,           // Replace with the actual score
    date: new Date().toLocaleString()
  };

  console.log('Sending score data to server:', dataToSend);

  fetch('https://mini-project-quiz-backend.onrender.com/save-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error saving score');
    }
    isScoreSaved=true
    return response.json();
  })
  .then(data => {
    console.log('Score saved:', data);
  })
  .catch(error => {
    console.error('Error saving score:', error);
  });
}

// Add an event listener to the exit button
exitBtn.addEventListener('click', () => {
  location.reload()
});



