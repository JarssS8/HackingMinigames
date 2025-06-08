let gridSize = 5;
let totalAttempts = 8;
let difficulty = 'easy';

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

function getPastelColor(distance) {
  if (distance === 0) return '#a3f7bf';       // Ganador - verde fuerte pastel
  if (distance === 1) return '#c1ffc1';       // Verde lima claro
  if (distance === 2) return '#b0c4de';       // Azul pastel
  if (distance === 3) return '#b2e0f7';       // Celeste
  if (distance === 4) return '#d6f5d6';       // Verde muy claro
  if (distance === 5) return '#fff2b2';       // Amarillo pastel
  if (distance === 6) return '#ffdab9';       // Durazno pastel
  return '#f8c8dc';                           // Muy lejos - rosa suave
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
  const color = getPastelColor(distance);

  cell.classList.add('clicked');
  cell.style.backgroundColor = color;

  if (difficulty === 'easy' && distance !== 0) {
    cell.textContent = distance;
  }

  if (distance === 0) {
    cell.textContent = '🏆';
    cell.style.backgroundColor = '#a3f7bf';
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
      cell.style.backgroundColor = '#a3f7bf';
      cell.textContent = '🏆';
    }
  });
}

function disableAllCells() {
  document.querySelectorAll('.cell').forEach(cell =>
    cell.removeEventListener('click', handleCellClick)
  );
}
