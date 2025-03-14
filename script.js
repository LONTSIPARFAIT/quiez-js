let quizData = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;

// Charger les questions depuis un fichier JSON
async function loadQuestions() {
    const response = await fetch("questions.json"); // Assurez-vous que questions.json est présent
    quizData = await response.json();
    quizData = quizData.sort(() => Math.random() - 0.5); // Mélanger les questions
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        endQuiz();
        return;
    }

    clearInterval(timer);
    timeLeft = 10;
    document.getElementById("time").textContent = timeLeft;
    timer = setInterval(updateTimer, 1000);

    const q = quizData[currentQuestion];
    document.getElementById("question").textContent = q.question;
    const optionsEl = document.getElementById("options");
    optionsEl.innerHTML = "";

    q.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="answer" value="${index}"> ${option}`;
        optionsEl.appendChild(label);
    });
}

function updateTimer() {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        nextQuestion(false); // Passer à la question suivante si le temps est écoulé
    }
}

document.getElementById("submit").addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) return;

    const selectedIndex = parseInt(selectedOption.value);
    const correctIndex = quizData[currentQuestion].correct;
    const options = document.querySelectorAll(".options label");

    options[selectedIndex].classList.add(selectedIndex === correctIndex ? "correct" : "wrong");

    setTimeout(() => nextQuestion(selectedIndex === correctIndex), 1000);
});

function nextQuestion(isCorrect) {
    clearInterval(timer);
    if (isCorrect) score++;

    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById("quiz").innerHTML = `<h2>Score: ${score}/${quizData.length}</h2>`;
    saveBestScore(score);
}

function saveBestScore(newScore) {
    const bestScore = localStorage.getItem("bestScore") || 0;
    if (newScore > bestScore) {
        localStorage.setItem("bestScore", newScore);
    }
    document.getElementById("best-score").textContent = localStorage.getItem("bestScore");
}

loadQuestions();
