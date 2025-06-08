let gridSize = 5;
let totalAttempts = 8;
let difficulty = 'hard';

let winningCell = null;
let attemptsLeft = 0;

const grid = document.getElementById('grid');
const attemptsDisplay = document.getElementById('attemptsLeft');
const info = document.getElementById('info');

function startGame() {
  difficulty = document.getElementById('difficultySelect').value;
  gridSize = parseInt(document.getElementById('gridSizeInput').value);
  totalAttempts = parseInt(document.getElementById('attemptsInput').value);

  attemptsLeft = totalAttempts;
  winningCell = generateWinningCell();
  attemptsDisplay.textContent = attemptsLeft;
  info.style.display = 'block';
  createGrid();
}

function generateWinningCell() {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
}

function getDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getHeatColor(distance) {
  const maxDistance = gridSize * 2 - 2;
  const ratio = 1 - (distance / maxDistance);
  const red = Math.round(255 * (1 - ratio));
  const green = Math.round(200 * ratio);
  const blue = 50;
  return `rgb(${red}, ${green}, ${blue})`;
}

function createGrid() {
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
  grid.style.gridTemplateRows = `repeat(${gridSize}, 60px)`;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', handleCellClick);
      grid.appendChild(cell);
    }
  }
}

function handleCellClick(e) {
  const cell = e.target;
  if (cell.classList.contains('clicked') || attemptsLeft <= 0) return;

  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  const clicked = { x, y };
  const distance = getDistance(clicked, winningCell);
  const color = getHeatColor(distance);

  cell.classList.add('clicked');
  cell.style.backgroundColor = color;

  if (difficulty === 'easy' && distance !== 0) {
    cell.textContent = distance;
  }

  if (distance === 0) {
    cell.textContent = '🏆';
    cell.style.backgroundColor = '#00c853';
    disableAllCells();
    return;
  }

  attemptsLeft--;
  attemptsDisplay.textContent = attemptsLeft;

  if (attemptsLeft === 0) {
    revealWinningCell();
    disableAllCells();
  }
}

function revealWinningCell() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    if (x === winningCell.x && y === winningCell.y) {
      cell.classList.add('clicked');
      cell.style.backgroundColor = '#00c853';
      cell.textContent = '🏆';
    }
  });
}

function disableAllCells() {
  document.querySelectorAll('.cell').forEach(cell =>
    cell.removeEventListener('click', handleCellClick)
  );
}
