
let progressInterval;
let randomInterval;
const backgroundColor = "#080c16";
const boderColor = "#182134";
const colors = {
    "gris": "#808080", // gray
    "naranja": "#c6732b", // orange
    "azul": "#0b66dd", // blueDX
    "rojo": "#ab3628", // red
    "verde": "#6c992d", // green
    "rosa": "#d963a9", // pink
    "violeta": "#6d5cc0", // purple
    "blanco": "#fefefe", // white
    "celeste": "#44ede9", // cyan
    "amarillo": "#f7cd4c", // yellow
};
const icons = ["fa-server", "fa-link", "fa-folder", "fa-wifi", "fa-gamepad", "fa-gears", "fa-bug", "fa-bomb", "fa-laptop", "fa-cloud", "fa-power-off"];
let currentIndex = 0;

function removeIcons() {
    const iconsDiv = document.getElementById("icons");
    while (iconsDiv.firstChild) {
        iconsDiv.removeChild(iconsDiv.firstChild);
    }
}

function showIcons() {
    removeIcons();
    const iconsDiv = document.getElementById("icons");
    const sliderValue = document.getElementById("colors").value; // Obtener el valor del slider
    const colorKeys = Object.keys(colors); // Obtener las claves de los colores

    for (let i = 0; i < sliderValue; i++) {
        let color = colorKeys[i % colorKeys.length]; // Ciclar a través de los colores si el slider excede el número de colores
        let icon = document.createElement("i");
        icon.className = `icon fa-solid fa-question`;
        icon.style.color = "white";
        icon.dataset.color = color;
        iconsDiv.appendChild(icon);
    }
}

let iconColorMap = {}; // Variable para guardar los colores y los iconos como clave-valor

function buttonStart() {
    const streak = document.getElementById("streak");
    streak.textContent = 0;
    startGame();
}

function startGame() {
    reset(); // Reiniciar el juego
    const rememberTime = document.getElementById("remember-time").value * 1000; // Tiempo para recordar en ms
    const sliderValue = document.getElementById("colors").value; // Cantidad de iconos

    let iterations = 0; // Contador para las 5 iteraciones
    randomInterval = setInterval(() => {
        showRandomIcons(sliderValue); // Mostrar iconos aleatorios
        iterations++;

        if (iterations > 5) {
            clearInterval(randomInterval); // Detener el intervalo tras 5 iteraciones

            // Mostrar los iconos reales
            showRealIcons(sliderValue);

            // Mostrar la barra de progreso
            const progressBar = document.getElementById("progress-bar");
            const progressContainer = document.getElementById("progress-container");
            progressContainer.style.display = "block";
            progressBar.value = 0;

            let elapsed = 0;
            progressInterval = setInterval(() => {
                elapsed += 100; // Incrementar cada 100 ms
                progressBar.value = (elapsed / rememberTime) * 100;

                if (elapsed >= rememberTime) {
                    clearInterval(progressInterval);
                    progressContainer.style.display = "none"; // Ocultar la barra de progreso

                    // Guardar los colores y los iconos en la variable clave-valor
                    const iconsDiv = document.getElementById("icons").children;
                    iconColorMap = {};
                    for (let icon of iconsDiv) {
                        iconColorMap[icon.className] = icon.dataset.color;
                    }

                    // Mostrar los iconos de forma aleatoria
                    showRandomIcons();

                    // Preguntar por los colores
                    document.getElementById("game").style.display = "flex";
                    document.getElementById("icons").style.display = "none";
                    nextIcon(); // Mostrar el primer icono
                }
            }, 100); // Actualizar cada 100 ms
        }
    }, 500); // Intervalo de 500 ms
}
function showRealIcons(sliderValue) {
    removeIcons();
    const iconsDiv = document.getElementById("icons");
    const shuffledColors = shuffleArray(Object.keys(colors));
    const shuffledIcons = shuffleArray([...icons]);

    for (let i = 0; i < sliderValue; i++) {
        let color = shuffledColors[i % shuffledColors.length];
        let icon = shuffledIcons[i % shuffledIcons.length];

        let iconElement = document.createElement("i");
        iconElement.className = `icon fa-solid ${icon}`;
        iconElement.style.color = colors[color];
        iconElement.dataset.icon = icon;
        iconElement.dataset.color = color;
        iconsDiv.appendChild(iconElement);
    }
    saveData();
}

function saveData() {
    let iconColorMap = {};
    const iconsDiv = document.getElementById("icons").children;
    for (let icon of iconsDiv) {
        iconColorMap[icon.dataset.icon] = icon.dataset.color;
    }
}

function showRandomIcons(sliderValue) {
    removeIcons();
    const iconsDiv = document.getElementById("icons");
    const shuffledColors = shuffleArray(Object.keys(colors));
    const randomIcons = shuffleArray([...icons]); // Barajar los iconos

    for (let i = 0; i < sliderValue; i++) {
        let color = shuffledColors[i % shuffledColors.length];
        let iconElement = document.createElement("i");
        iconElement.className = `icon fa-solid ${randomIcons[i]}`;
        iconElement.style.color = colors[color]; // Ocultar el color real
        iconsDiv.appendChild(iconElement);
    }
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateValue(spanId, value) {
    document.getElementById(spanId).textContent = value + "s";
}

function updateIcons(spanId, value) {
    document.getElementById(spanId).textContent = value;
    showIcons();
}

function updateStreak(fail) {
    const streak = document.getElementById("streak");
    const bestStreak = document.getElementById("best-streak");
    const currentStreak = parseInt(streak.textContent);
    const currentBestStreak = parseInt(bestStreak.textContent);
    if (fail) {
        streak.textContent = 0;
        return;
    }
    streak.textContent = currentStreak + 1;

    if (currentStreak >= currentBestStreak) {
        bestStreak.textContent = currentStreak + 1;
    }

}

function nextIcon() {
    const iconKeys = Object.keys(iconColorMap); // Get the keys (icon classes) from iconColorMap
    document.getElementById("feedback").innerText = ""; // Clear the feedback text
    if (iconKeys.length === 0) {
        document.getElementById("feedback").innerText = "¡Has ganado!";
        document.getElementById("feedback").style.color = "green";
        document.getElementById("game").style.display = "none"; // Hide the game interface
        updateStreak(); // Update the streak
        startGame(); // Restart the game
        return;
    }

    // Choose a random icon from iconColorMap
    const randomIndex = Math.floor(Math.random() * iconKeys.length);
    const currentIconClass = iconKeys[randomIndex]; // Get the random icon class
    const currentColor = iconColorMap[currentIconClass]; // Get the associated color from iconColorMap

    // Update the current icon and its associated color
    const icon = document.getElementById("currentIcon");
    icon.className = `icon fa-solid ${currentIconClass}`;
    icon.style.color = "white"; // Hide the color initially
    icon.dataset.icon = currentIconClass; // Store the correct icon in the dataset
    icon.dataset.color = currentColor; // Store the correct color in the dataset

    // Reset progress bar
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    progressContainer.style.display = "block";
    progressBar.value = 0;

    const thinkTime = document.getElementById("think-time").value * 1000; // Get the thinking time in ms
    let elapsed = 0;

    progressInterval = setInterval(() => {
        elapsed += 100; // Increment every 100 ms
        progressBar.value = (elapsed / thinkTime) * 100;

        if (elapsed >= thinkTime) {
            clearInterval(progressInterval);
            progressContainer.style.display = "none"; // Hide the progress bar
            document.getElementById("feedback").innerText = "FALLASTE";
            document.getElementById("feedback").style.color = "red";
            updateStreak(true);
            document.getElementById("colorInput").disabled = true;
        }
    }, 100); // Update every 100 ms
}

function checkColor() {
    const input = document.getElementById("colorInput").value.toLowerCase();
    const correctColor = document.getElementById("currentIcon").dataset.color;
    const feedback = document.getElementById("feedback");
    const progressContainer = document.getElementById("progress-container");

    if (input === correctColor) {
        feedback.innerText = "¡Correcto!";
        clearInterval(progressInterval);
        feedback.style.color = "green";
        document.getElementById("currentIcon").style.color = colors[correctColor]; // Show the correct color
        document.getElementById("colorInput").value = ""; // Clear the input field

        // Remove the guessed icon from iconColorMap
        console.log(iconColorMap);
        delete iconColorMap[document.getElementById("currentIcon").dataset.icon];
        console.log(iconColorMap);

        // Stop the progress bar and move to the next icon
        progressContainer.style.display = "none";
        setTimeout(nextIcon, 500); // Move to the next icon after 500 ms
    } else {
        clearInterval(progressInterval);
        progressContainer.style.display = "none"; // Hide the progress bar
        feedback.innerText = "FALLASTE";
        feedback.style.color = "red";
        updateStreak(true);
        document.getElementById("colorInput").disabled = true;
    }
}

function reset() {
    currentIndex = 0;
    document.getElementById("colorInput").disabled = false;
    document.getElementById("feedback").innerText = "";
    document.getElementById("feedback").style.color = "";
    document.getElementById("icons").style.display = "flex";
    document.getElementById("game").style.display = "none";
    document.getElementById("colorInput").value = "";
    const progressContainer = document.getElementById("progress-container");
    progressContainer.style.display = "none";
    clearInterval(progressInterval)
    clearInterval(randomInterval);
    iconColorMap = {};
    showIcons();
}

document.getElementById("colorInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkColor();
    }
});

showIcons();
