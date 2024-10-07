// Game variables
let currentPlayer, computerPlayer, gameActive = false, playerSelected = false;
let gameBoard = Array(9).fill(null);
let playerScore = 0, computerScore = 0, ties = 0;

// DOM element selectors
const selectXButton = document.getElementById('choose-x');
const selectOButton = document.getElementById('choose-o');
const startGameButton = document.getElementById('start-game-button');
const resetGameButton = document.getElementById('reset-game');
const gameContainer = document.getElementById('game-container');
const selectionContainer = document.getElementById('player-selection-container');
const gameStatus = document.getElementById('turn-indicator');
const playerScoreElement = document.getElementById('player-score');
const cpuScoreElement = document.getElementById('cpu-score');
const tiesElement = document.getElementById('ties');
const roundEndModal = document.getElementById('round-end-modal');
const restartModal = document.getElementById('restart-modal');
const roundResultText = document.getElementById('round-result');
const nextRoundButton = document.getElementById('next-round');
const quitButton = document.getElementById('quit-game');

// Utility functions to update DOM elements
const updateTextContent = (element, text) => element.textContent = text;
const toggleDisplay = (element, displayStyle) => element.style.display = displayStyle;

// Function to reset the game state (used when the game is restarted)
const resetGameState = () => {
  gameBoard.fill(null);
  document.querySelectorAll('.grid-cell').forEach(cell => cell.textContent = '');
  gameActive = false;
  playerSelected = false;
  toggleDisplay(selectionContainer, 'block');
  toggleDisplay(gameContainer, 'none');
  selectXButton.classList.remove('selected');
  selectOButton.classList.remove('selected');
  console.log("Game state reset. Returning to player selection.");
};

// Function to handle player selection (X or O)
const selectPlayer = (selectedPlayer) => {
  currentPlayer = selectedPlayer;
  computerPlayer = currentPlayer === 'X' ? 'O' : 'X';
  playerSelected = true;
  selectXButton.classList.toggle('selected', currentPlayer === 'X');
  selectOButton.classList.toggle('selected', currentPlayer === 'O');
  console.log(`Player selected: ${currentPlayer}, Computer is: ${computerPlayer}`);
};

// Function to start the game (only if X or O has been selected)
const startGame = () => {
  if (!playerSelected) {
    alert("Please select X or O before starting the game.");
    console.log("Player has not selected X or O.");
    return;
  }
  console.log(`New game started with player: ${currentPlayer}`);
  gameActive = true;
  toggleDisplay(selectionContainer, 'none');
  toggleDisplay(gameContainer, 'block');
  updateTextContent(gameStatus, `${currentPlayer} Turn`);
};

// Function to make a move - called when a player or computer clicks on a cell
const makeMove = (position, player) => {
  gameBoard[position] = player;
  document.querySelector(`.grid-cell[value="${position}"]`).textContent = player;
  console.log(`${player} moves to position ${position}`);
  return checkWinner(player) || checkDraw();
};

// Function to check if a player has won
const checkWinner = (player) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  const isWinner = winningCombinations.some(combo => combo.every(i => gameBoard[i] === player));
  if (isWinner) {
    console.log(`Winner found: ${player}`);
    gameActive = false;
    updateTextContent(gameStatus, `Player ${player} Wins!`);
    updateScores(player);
    showEndModal(`Player ${player} wins!`);
  }
  return isWinner;
};

// Function to check if the game is a draw (all cells filled and no winner)
const checkDraw = () => {
  if (gameBoard.every(cell => cell !== null)) {
    console.log("It's a draw.");
    updateTextContent(gameStatus, "It's a Draw!");
    ties++;
    updateTextContent(tiesElement, `Ties: ${ties}`);
    gameActive = false;
    showEndModal("It's a Draw!");
    return true;
  }
  return false;
};

// Function to update the score
const updateScores = (winner) => {
  if (winner === currentPlayer) {
    playerScore++;
    updateTextContent(playerScoreElement, `X (YOU): ${playerScore}`);
  } else {
    computerScore++;
    updateTextContent(cpuScoreElement, `O (CPU): ${computerScore}`);
  }
};

// Function to show the "End of Round" modal with the result
const showEndModal = (result) => {
  console.log(`End of round: ${result}`);
  updateTextContent(roundResultText, result);
  toggleDisplay(roundEndModal, 'block');
};

// Function to handle the computer's move
const computerMove = () => {
  const emptyCells = gameBoard.map((cell, index) => cell === null ? index : null).filter(i => i !== null);
  const randomPosition = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  console.log(`Computer clicks on cell ${randomPosition}`);
  if (!makeMove(randomPosition, computerPlayer)) {
    updateTextContent(gameStatus, `${currentPlayer} Turn`);
  }
};

// Event listeners
selectXButton.addEventListener('click', () => selectPlayer('X'));
selectOButton.addEventListener('click', () => selectPlayer('O'));
startGameButton.addEventListener('click', startGame);
resetGameButton.addEventListener('click', resetGameState);
document.querySelectorAll('.grid-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    const position = cell.getAttribute('value');
    if (gameActive && !gameBoard[position]) {
      console.log(`Player ${currentPlayer} clicked on cell ${position}`);
      if (!makeMove(position, currentPlayer)) {
        console.log("Switching to computer's turn.");
        setTimeout(computerMove, 500);
      }
    }
  });
});

nextRoundButton.addEventListener('click', () => {
  console.log("Next round started.");
  gameBoard.fill(null); // Reset the game board
  document.querySelectorAll('.grid-cell').forEach(cell => cell.textContent = ''); // Clear the UI
  gameActive = true; // Re-activate the game
  toggleDisplay(roundEndModal, 'none'); // Hide the "End of Round" modal
  updateTextContent(gameStatus, `${currentPlayer} Turn`); // Update the status for the next round
});

quitButton.addEventListener('click', () => {
  console.log("Game quit.");
  resetGameState(); // Reset the entire game state
  toggleDisplay(roundEndModal, 'none'); // Hide the "End of Round" modal
});

  // MY husband Lex helped me, he didnt give me answers but walked me through each step by a lot asking questions.