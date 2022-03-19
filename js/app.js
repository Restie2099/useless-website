// For tracking score
let currentScore = 0;
let totalQuestions = 0;

/**
 * Shuffles choices array ([source](https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4)).
 * @param {*} choices
 * @returns the shuffled choices
 */
function shuffleChoices(choices) {
  return choices
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

/**
 * Requests a trivia from [Open Trivia DB](https://opentdb.com/).
 * @returns a trivia
 */
async function requestTrivia() {
  const response = await fetch('https://opentdb.com/api.php?amount=1');
  let responseJson = await response.json();
  responseJson = responseJson.results[0];

  let choices = responseJson.incorrect_answers
    .map((choice) => {
      return choice;
    })
    .concat([responseJson.correct_answer]);

  return {
    question: responseJson.question,
    choices: shuffleChoices(choices),
    correctAnswer: responseJson.correct_answer,
    type: responseJson.type,
  };
}

/**
 * Update displayed elements when a choice is selected.
 * @param {*} correctAnswer
 * @param {*} selectedAnswer
 */
function selectChoice(correctAnswer, selectedAnswer) {
  // Update displayed choices
  let choicesElem = document.getElementById('choices-container');
  Array.from(choicesElem.children).forEach((li) => {
    if (correctAnswer === li.innerHTML) {
      li.classList.add('correct-answer');
    } else {
      li.classList.add('incorrect-answer');
    }
  });

  // Update displayed score
  if (correctAnswer === selectedAnswer) {
    currentScore++;
  }
  totalQuestions++;
  let scoreElem = document.getElementById('score-container');
  scoreElem.innerHTML = `Score: ${currentScore} out of ${totalQuestions}`;

  // Show next button
  let nextBtn = document.getElementById('next-trivia-btn');
  nextBtn.classList.remove('hide-button');
}

/**
 * Fetch a trivia and display it on screen.
 */
async function getTrivia() {
  // Reset elements
  let questionElem = document.getElementById('question-container');
  questionElem.innerHTML = 'Loading question...';
  let choicesElem = document.getElementById('choices-container');
  choicesElem.innerHTML = '';

  // Hide next button
  let nextBtn = document.getElementById('next-trivia-btn');
  nextBtn.classList.add('hide-button');

  // Fetch trivia
  let trivia = await requestTrivia();
  console.log(trivia);

  // Update displayed question
  questionElem.innerHTML = trivia.question;

  // Update displayed choices
  trivia.choices.forEach((choice) => {
    let li = document.createElement('li');
    li.className = 'trivia-choice';
    li.addEventListener(
      'click',
      function () {
        selectChoice(trivia.correctAnswer, choice);
      },
      false
    );
    li.innerHTML = choice;
    choicesElem.appendChild(li);
  });
}
