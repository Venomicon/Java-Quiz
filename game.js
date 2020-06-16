const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterHUD = document.getElementById('questionCounter');
const scoreHUD = document.getElementById('score');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter;
let availableQuestions = [];
 
let questions = [];

fetch("questions.json")
	.then( res => {
		return res.json();
	})
	.then(loadedQuestions => {
		questions = loadedQuestions;
		game.classList.remove('hidden');
		loader.classList.add('hidden');	
		startGame();
	})
	.catch(err => {
		console.error(err);
	});

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

let startGame = function() {
	questionCounter = 0;
	score = 0;
	availableQuestions = [...questions];
	getNewQuestion(); 
}

let getNewQuestion = function() {
	if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
		localStorage.setItem('mostRecentScore', score);
		return window.location.assign('end.html');
	}
	questionCounter++;
	questionCounterHUD.innerText = questionCounter + '/' + MAX_QUESTIONS;

	const questionIndex = Math.floor(Math.random()*availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;

	choices.forEach(choice => {
		const number = choice.dataset['number'];
		choice.innerText = currentQuestion['choice' + number];
	});

	availableQuestions.splice(questionIndex, 1);

	acceptingAnswers = true;
};

choices.forEach(choice => {
	choice.addEventListener('click', e => {
		if (!acceptingAnswers) return;

		acceptingAnswers = false;
		const selectedChoice = e.target;
		const selectedAnswer = selectedChoice.dataset['number'];

		let classToApply = 'incorrect';
		if (selectedAnswer == currentQuestion.answer) {
			classToApply = 'correct';
		}

		if (classToApply === 'correct') {
			incrementScore(CORRECT_BONUS);
		}
		
		selectedChoice.parentElement.classList.add(classToApply);
		setTimeout( () => {
			selectedChoice.parentElement.classList.remove(classToApply);
			getNewQuestion();
		}, 1000);
	});
});

let incrementScore = function(num) {
	score += num;
	scoreHUD.innerText = score;
}

