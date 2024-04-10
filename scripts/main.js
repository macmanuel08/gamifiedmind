const currentYear = new Date().getFullYear();
document.querySelector('.current-year').textContent = currentYear;

const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('header nav');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
});

function getParent(childElement, parentClass) {
    
    let parent = childElement.parentElement;
  
    while (parent) {
      if (parent.classList.contains(parentClass)) {
        console.log(parent)
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

/************************/
const quizContainer = document.querySelector('.quiz-container');

class QuizModel {
    constructor(quizzes) {
        this.quizzes = quizzes;
        this.questionIndices = new Set();
        this.randomQuestions = this.getQuestions();
    }

    getQuestions() {
        let questions = new Array();

        while (this.questionIndices.size != 5) {
            const randomNumber = Math.floor(Math.random() * this.quizzes.length);
            this.questionIndices.add(randomNumber);
        }

        for (const i of this.questionIndices) {
            questions.push(this.quizzes[i]);
        }

        return questions;
    }

    getCorrectAnswers() {
        const questions = this.randomQuestions;
        const correctAnswersArray = [];
        questions.forEach(question => {
            correctAnswersArray.push(question.answer);
        });
        return correctAnswersArray;
    }

    getScore() {
        let score = 0;
        const answers = this.getCorrectAnswers();
        const userAnswers = this.getUserAnswers();
        userAnswers.forEach((userAnswer, i) => {
            if (userAnswer.dataset.value == answers[i]) score++;
        });

        return score;
    }

    getUserAnswers() {
        return document.querySelectorAll('.option.selected');
    }

    displayAnswers() {
        const answers = this.getCorrectAnswers();
        const userAnswerElements = document.querySelectorAll('.option.selected');

        userAnswerElements.forEach((userAnswerElement, i) => {
            const parentElement = getParent(userAnswerElement, "question-block");

            if (userAnswerElement.dataset.value != answers[i]) {
                parentElement.classList.add('incorrect');
                const explanationParagraph = document.createElement('p');
                explanationParagraph.classList.add('explanation');
                explanationParagraph.textContent = this.randomQuestions[i].explanation;
                parentElement.appendChild(explanationParagraph);
            } else {
                parentElement.classList.add('correct');
            }
        });
    }

    displayScore() {
        const scoreContainer = document.createElement('p');
        scoreContainer.textContent = `You got: ${this.getScore()}. ${this.getScore() <= 3 ? 'Nice Try.' : 'Awesome!'}`;
        scoreContainer.classList.add('score-container');
        quizContainer.appendChild(scoreContainer);
    }

}

class QuizView {
    constructor(model, controller) {
        this.model = model;
        this.controller = controller;
        this.questions = this.model.randomQuestions;
    }

    displayQuestion(quiz) {
        const questionBlock = document.createElement('div');
        questionBlock.classList.add('question-block');
        const question = document.createElement('p');
        question.classList.add('question-paragraph');
        const optionContainer = document.createElement('div');
        optionContainer.classList.add('options-block');
        question.textContent = quiz["question"];
        const letters = ['a.', 'b.', 'c.', 'd.', 'e.', 'f.'];
        let i = 0;

        for (const [key, value] of Object.entries(quiz.choices)) {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            optionDiv.setAttribute('data-value', key);
            optionDiv.textContent = `${letters[i]} ${value}`;
            i++;
            optionContainer.appendChild(optionDiv);
        }

        optionContainer.addEventListener('click', this.controller.handleOptionSelect.bind(optionContainer));
        
        questionBlock.appendChild(question);
        questionBlock.appendChild(optionContainer);
        quizContainer.append(questionBlock)
    }

    displayQuestions() {
        for (const question of this.questions) {
            this.displayQuestion(question);
        }

        const submit = document.createElement('button');
        submit.textContent = 'Submit Quiz';
        submit.addEventListener('click', this.controller.handleSubmit);
        submit.classList.add('btn', 'primary-btn');
        quizContainer.appendChild(submit);
    }
}

class QuizController {
    constructor(model) {
        this.model = model;
        this.optionSelected = [];
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleOptionSelect(e) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].classList.remove('selected');
        }
        
        e.target.classList.add('selected');
    }

    handleSubmit() {
        this.model.displayScore();
        this.model.displayAnswers();
        quizContainer.querySelector('.btn').style.display = "none";
        const cta = document.querySelector('.cta-container.hidden-animate');
        cta.classList.add('show');
    }
}

/************************/



fetch('../english-quizzes.json')
    .then(response => response.json())
    .then(data => {
        const quizData = data["english-quizzes"]
        const quizTopic = document.querySelector('.quiz-container').dataset.topic;

        const matchingQuiz = quizData.find(quiz => quiz.hasOwnProperty(quizTopic));
        const allQuestions = matchingQuiz[quizTopic];

        const model = new QuizModel(allQuestions);
        const controller = new QuizController(model); 
        const view = new QuizView(model, controller);
        view.displayQuestions();
        
    })
    .catch(error => console.error("Failed to load quiz data:", error));