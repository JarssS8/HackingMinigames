let gridSize = 5;
let totalAttempts = 8;
let hintMode = 'number'; // number, icons, coloronly
let visualMode = 'color'; // color, nocolor

let winningCell = null;
let attemptsLeft = 0;
let timer = null;
let timeLeft = 30; // segundos por defecto
let maxTime = 10; // Nuevo: tiempo máximo elegido

const grid = document.getElementById('grid');
const attemptsDisplay = document.getElementById('attemptsLeft');
const info = document.getElementById('info');
const timeDisplay = document.getElementById('timeLeft');

function updateVisualModeVisibility() {
  const hintModeSelect = document.getElementById('hintModeSelect');
  const visualModeLabel = document.getElementById('visualModeLabel');

  if (hintModeSelect.value === 'coloronly') {
    visualModeLabel.classList.add('hidden');
    document.getElementById('visualModeSelect').value = 'color';
  } else {
    visualModeLabel.classList.remove('hidden');
  }
}

function startGame() {
  hintMode = document.getElementById('hintModeSelect').value;
  visualMode = document.getElementById('visualModeSelect').value;
  gridSize = parseInt(document.getElementById('gridSizeInput').value);
  totalAttempts = parseInt(document.getElementById('attemptsInput').value);

  attemptsLeft = totalAttempts;
  winningCell = generateWinningCell();
  attemptsDisplay.textContent = attemptsLeft;
  info.style.display = 'block';
  createGrid();

  maxTime = parseInt(document.getElementById('timeSlider').value); // Nuevo: lee el tiempo del slider
  clearInterval(timer);
  timeLeft = maxTime;
  updateTimerDisplay();
  updateTimeBar(); // Nuevo: actualiza la barra al iniciar
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    updateTimeBar(); // Nuevo: actualiza la barra cada segundo
    if (timeLeft <= 0) {
      clearInterval(timer);
      revealWinningCell();
      disableAllCells();
      info.textContent = "¡Tiempo agotado! Perdiste.";
      info.style.display = 'block';
    }
  }, 1000);
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

// NUEVA ESCALA DE COLOR
function getHeatColor(distance) {
  if (distance === 0) return '#0eb05a';       // Tesoro
  if (distance === 1) return '#a8f5b0';       // Verde claro
  if (distance === 2) return '#fff9b0';       // Amarillo claro
  if (distance === 3) return '#ffd966';       // Amarillo oscuro
  if (distance === 4) return '#ff944d';       // Naranja
  if (distance === 5) return '#ff4d4d';       // Rojo
  return '#b30000';                           // Rojo oscuro
}

function getChessIconClass(distance) {
  if (distance === 1) return 'fa-chess-king';
  if (distance === 2) return 'fa-chess-queen';
  if (distance === 3) return 'fa-chess-bishop';
  if (distance === 4) return 'fa-chess-knight';
  if (distance === 5) return 'fa-chess-rook';
  return 'fa-chess-pawn';
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

  cell.classList.add('clicked');

  if (distance === 0) {
    cell.innerHTML = '<i class="fas fa-trophy"></i>';
    cell.style.backgroundColor = getHeatColor(0);
    disableAllCells();
    clearInterval(timer); // Detener timer si ganas
    return;
  }

    if (hintMode === 'icons') {
      const icon = document.createElement('i');
      icon.classList.add('fas', getChessIconClass(distance));
      cell.appendChild(icon);
    } else if (hintMode === 'number') {
      const span = document.createElement('span');
      span.textContent = distance;
      cell.appendChild(span);
    }

  if (visualMode === 'color' || hintMode === 'coloronly') {
    cell.style.backgroundColor = getHeatColor(distance);
  }

  attemptsLeft--;
  attemptsDisplay.textContent = attemptsLeft;

  if (attemptsLeft === 0) {
    revealWinningCell();
    disableAllCells();
    clearInterval(timer); // Detener timer si pierdes por intentos
  }
}

function revealWinningCell() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    if (x === winningCell.x && y === winningCell.y) {
      cell.classList.add('clicked');
      cell.style.backgroundColor = getHeatColor(0);
      cell.innerHTML = '<i class="fas fa-trophy"></i>';
    }
  });
}

function updateTimerDisplay() {
  if (timeDisplay) {
    timeDisplay.textContent = timeLeft;
  }
}

function updateTimeBar() {
  const bar = document.getElementById('timeBar');
  if (bar) {
    const percent = Math.max(0, (timeLeft / maxTime) * 100);
    bar.style.width = percent + "%";
  }
}

function disableAllCells() {
  document.querySelectorAll('.cell').forEach(cell =>
    cell.removeEventListener('click', handleCellClick)
  );
}
