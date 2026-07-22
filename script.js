const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const hintButton = document.getElementById('hintButton');
const newGameButton = document.getElementById('newGameButton');
const guessCountDisplay = document.getElementById('guessCount');
const hintCountDisplay = document.getElementById('hintCount');
const message = document.getElementById('message');
const hintMessage = document.getElementById('hintMessage');
const hintHistoryList = document.getElementById('hintHistoryList');

const MAX_GUESSES = 3;
const MAX_HINTS = 4;

let correctNumber = 0;
let guessesUsed = 0;
let hintsUsed = 0;
let gameOver = false;
let hintHistory = [];

function startNewGame() {
  correctNumber = Math.floor(Math.random() * 100) + 1;
  guessesUsed = 0;
  hintsUsed = 0;
  gameOver = false;
  guessInput.value = '';
  guessInput.disabled = false;
  guessButton.disabled = false;
  hintButton.disabled = false;
  message.textContent = 'Start a new game and make your first guess!';
  hintMessage.textContent = '';
  hintHistory = [];
  renderHintHistory();
  updateStatus();
  guessInput.focus();
}

function updateStatus() {
  guessCountDisplay.textContent = `${guessesUsed}/${MAX_GUESSES}`;
  hintCountDisplay.textContent = `${MAX_HINTS - hintsUsed}`;
  guessButton.textContent = `Guess (${MAX_GUESSES - guessesUsed})`;
  hintButton.textContent = `Hint (${MAX_HINTS - hintsUsed})`;
  hintButton.disabled = gameOver || hintsUsed >= MAX_HINTS;
  guessButton.disabled = gameOver || guessesUsed >= MAX_GUESSES;
  guessInput.disabled = gameOver || guessesUsed >= MAX_GUESSES;
}

function handleGuess() {
  if (gameOver) {
    return;
  }

  const rawValue = guessInput.value.trim();
  if (!rawValue) {
    message.textContent = 'Please enter a number between 1 and 100.';
    return;
  }

  const guess = Number(rawValue);
  if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
    message.textContent = 'Please enter a whole number between 1 and 100.';
    return;
  }

  guessesUsed += 1;

  if (guess === correctNumber) {
    message.textContent = `🎉 Correct! The number was ${correctNumber}.`;
    hintMessage.textContent = 'You nailed it!';
    gameOver = true;
    updateStatus();
    return;
  }

  if (guessesUsed < MAX_GUESSES) {
    const difference = Math.abs(correctNumber - guess);
    const isFar = difference >= 20;
    message.textContent =
      guess < correctNumber
        ? isFar
          ? 'Good guess, but you guessed too low.'
          : 'Good guess, but you guessed a little too low.'
        : isFar
          ? 'Good guess, but you guessed too high.'
          : 'Good guess, but you guessed a little too high.';
    hintMessage.textContent = hintsUsed < MAX_HINTS
      ? 'You still have hints left if you want one.'
      : 'No hints left. Use your remaining guesses wisely!';
  } else {
    message.textContent = `Good try, but the answer was ${correctNumber}.`;
    hintMessage.textContent = 'Start a new game to play again!';
    gameOver = true;
  }

  updateStatus();
  guessInput.value = '';
  guessInput.focus();
}

function renderHintHistory() {
  if (!hintHistory.length) {
    hintHistoryList.innerHTML = '<li>No hints yet — use the Hint button to save clues here.</li>';
    return;
  }

  hintHistoryList.innerHTML = hintHistory
    .map((hint) => `<li>${hint}</li>`)
    .join('');
}

function handleHint() {
  if (gameOver || hintsUsed >= MAX_HINTS) {
    return;
  }

  hintsUsed += 1;

  let hintText = '';
  if (hintsUsed === 1) {
    hintText = correctNumber <= 50
      ? 'Hint 1: The secret number is in the lower half of the range: 1 to 50.'
      : 'Hint 1: The secret number is in the upper half of the range: 51 to 100.';
  } else if (hintsUsed === 2) {
    if (correctNumber <= 25) {
      hintText = 'Hint 2: The secret number is in the first quarter: 1 to 25.';
    } else if (correctNumber <= 50) {
      hintText = 'Hint 2: The secret number is in the second quarter: 26 to 50.';
    } else if (correctNumber <= 75) {
      hintText = 'Hint 2: The secret number is in the third quarter: 51 to 75.';
    } else {
      hintText = 'Hint 2: The secret number is in the fourth quarter: 76 to 100.';
    }
  } else if (hintsUsed === 3) {
    const digitSum = Math.floor(correctNumber / 10) + (correctNumber % 10);
    hintText = `Hint 3: The sum of the digits is ${digitSum}.`;
  } else {
    hintText = correctNumber % 2 === 0
      ? 'Hint 4: The secret number is even.'
      : 'Hint 4: The secret number is odd.';
  }

  hintHistory.push(hintText);
  hintMessage.textContent = hintText;
  message.textContent = 'A hint has been revealed.';
  renderHintHistory();
  updateStatus();
}

guessButton.addEventListener('click', handleGuess);
hintButton.addEventListener('click', handleHint);
newGameButton.addEventListener('click', startNewGame);

guessInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleGuess();
  }
});

startNewGame();
