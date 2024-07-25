document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('.start-btn');
  const popUp = document.querySelector('.popup');
  const back = document.querySelector('.back');
  const main = document.querySelector('.main');
  const btnExitQuiz = document.querySelector('.btn-exit');

  startBtn.onclick = () => {
    popUp.classList.add('active');
    main.classList.add('active');
  };

  back.onclick = () => {
    popUp.classList.remove('active');
    main.classList.remove('active');
  };
  const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};


  const btnStart = document.querySelector('.btn-start');
  const numQuestions = document.querySelector('#numQuestions');
  const category = document.querySelector('#category');
  const difficulty = document.querySelector('#difficulty');
  const timePerQuestion = document.querySelector('#time');
  const quiz = document.querySelector('.quiz');
  const startScreen = document.querySelector('.start-screen');

  let questions = [];
  let time = 30;
  let score = 0;
  let currentQuestion;
  let timer;

  const startQuiz = async () => {
    const selectedCategory = category.value;
    const selectedDifficulty = difficulty.value;
    const selectedNumQuestions = numQuestions.value;

    try {
      const response = await fetch(`http://localhost:3000/api/questions?category=${selectedCategory}&difficulty=${selectedDifficulty}&numQuestions=${selectedNumQuestions}`);
      questions = await response.json();

      if (questions.length === 0) {
        alert('No questions available for the selected subject.');
        return;
      }

      questions.sort(() => Math.random() - 0.5);
      document.querySelector('.total').textContent = `/${questions.length}`;
      startScreen.classList.add('hide');
      quiz.classList.remove('hide');
      currentQuestion = 1;
      showQuestion(questions[0]);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to fetch questions. Please try again later.');
    }
  };

  btnStart.addEventListener('click', startQuiz);
  

  const submitBtn = document.querySelector('.btn-submit');
  const nextBtn = document.querySelector('.btn-next');

  const showQuestion = (question) => {
    const questionText = document.querySelector('.question');
    const answersWrapper = document.querySelector('.answer-wrapper');
    const questionNumber = document.querySelector('.number');

    questionText.innerHTML = question.question;
    const answers = [
      ...question.incorrect_answers,
      question.correct_answer.toString(),
    ];
    answersWrapper.innerHTML = '';
    answers.sort(() => Math.random() - 0.5);
    answers.forEach((answer) => {
      answersWrapper.innerHTML += `
        <div class="answer">
          <span class="text">${answer}</span>
          <span class="checkbox">
            <span class="icon">✓</span>
          </span>
        </div>
      `;
    });
    questionNumber.innerHTML = `Question <span class="current">${questions.indexOf(question) + 1}</span>
      <span class="total">/${questions.length}</span>`;

    const answersDiv = document.querySelectorAll('.answer');
    answersDiv.forEach((answer) => {
      answer.addEventListener('click', () => {
        if (!answer.classList.contains('checked')) {
          answersDiv.forEach((answer) => {
            answer.classList.remove('selected');
          });
          answer.classList.add('selected');
          submitBtn.disabled = false;
        }
      });
    });

    time = timePerQuestion.value;
    startTimer(time);
  };

  const startTimer = (time) => {
    timer = setInterval(() => {
      if (time === 3) {
        playAdudio("countdown.mp3");
      }
      if (time >= 0) {
        progress(time);
        time--;
      } else {
        checkAnswer();
      }
    }, 1000);
  };

  submitBtn.addEventListener('click', () => {
    checkAnswer();
  });

  const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
      const answer = selectedAnswer.querySelector(".text").innerHTML;
      if (answer === questions[currentQuestion - 1].correct_answer) {
        score++;
        selectedAnswer.classList.add("correct");
      } else {
        selectedAnswer.classList.add("wrong");
        document.querySelectorAll(".answer").forEach((answer) => {
          if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
            answer.classList.add("correct");
          }
        });
      }
    } else {
      document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
          answer.classList.add("correct");
        }
      });
    }
  
    document.querySelectorAll(".answer").forEach((answer) => {
      answer.classList.add("checked");
    });
  
    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
  };
  
  nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
  });
  
  const nextQuestion = () => {
    if (currentQuestion < questions.length) {
      currentQuestion++;
      showQuestion(questions[currentQuestion - 1]);
    } else {
      showScore();
    }
  };
  
  const endScreen = document.querySelector(".end-screen");
  const finalScore = document.querySelector(".final-score");
  const totalScore = document.querySelector(".total-score");
  
  const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${questions.length}`;
  };

const restartBtn = document.querySelector('.restart');
  restartBtn.addEventListener('click', () => {
    location.reload();
  });
  const playAdudio = (src) => {
    const audio = new Audio(src);
    audio.play();
  };
  const exitQuiz = () => {
    const confirmExit = confirm('Are you sure you want to exit the quiz?');
    if (confirmExit) {
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    // Reset quiz data
    currentQuestion = 0;
    questions = [];
    score = 0;
    clearInterval(timer);

    // Reset UI elements
    startScreen.classList.remove('hide');
    quiz.classList.add('hide');
    endScreen.classList.add('hide');
    main.classList.remove('active');
    popUp.classList.remove('active');

    // Clear question and answers display
    document.querySelector('.question').innerHTML = '';
    document.querySelector('.answer-wrapper').innerHTML = '';
    document.querySelector('.number').innerHTML = '';

    // Reset buttons
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
  };

  btnExitQuiz.addEventListener('click', exitQuiz);
});

