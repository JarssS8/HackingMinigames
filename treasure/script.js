// CONFIGURACIÓN
const gridSize = 9;       // Tamaño de la cuadrícula (5x5, 6x6, etc.)
const totalAttempts = 8;  // Intentos máximos
let difficulty = 'easy';  // 'easy' o 'hard'

// VARIABLES DE JUEGO
let winningCell = null;
let attemptsLeft = totalAttempts;

const grid = document.getElementById('grid');
const attemptsDisplay = document.getElementById('attemptsLeft');

// GENERAR CELDA GANADORA
function generateWinningCell() {
  const x = Math.floor(Math.random() * gridSize);
  const y = Math.floor(Math.random() * gridSize);
  return { x, y };
}

// DISTANCIA MANHATTAN
function getDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// MAPA DE CALOR PASTEL
function getPastelColor(distance) {
  switch (distance) {
    case 0: return '#a3f7bf';  // Verde pastel (ganador)
    case 1: return '#b3e5fc';  // Azul pastel
    case 2: return '#fff9b0';  // Amarillo claro
    case 3: return '#ffd6a5';  // Naranja pastel
    default: return '#ffb3ba'; // Rosa pastel
  }
}

// CREAR CUADRÍCULA
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

// CLIC EN CELDA
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

// MOSTRAR CASILLA GANADORA
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

// DESACTIVAR TODAS LAS CELDAS
function disableAllCells() {
  document.querySelectorAll('.cell').forEach(cell =>
    cell.removeEventListener('click', handleCellClick)
  );
}

// REINICIAR JUEGO
function resetGame() {
  winningCell = generateWinningCell();
  attemptsLeft = totalAttempts;
  attemptsDisplay.textContent = attemptsLeft;
  createGrid();
}

// INICIAR
resetGame();
