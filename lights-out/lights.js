let maxStreak = document.getElementsByClassName("max_streak");
let actualStreak = document.getElementsByClassName("actual_streak");
let squares = document.getElementsByClassName("square");
let quantity = 0
let rows = document.getElementsByClassName("hardness")
var id = null;

function againButton() {
    for (let i = 0; i < squares.length; i++)
        if (squares[i].classList.contains("endgame-square-active")) {
            squares[i].classList.add("active-square")
            squares[i].classList.remove("endgame-square-active")
        } else {
            squares[i].classList.remove("endgame-square")
        }
    restartMiniGame(true)
}

function playBtnMinigame() {
    let splash = document.getElementsByClassName("splash")
    let squares = document.getElementsByClassName("squares")
    let retry = document.getElementsByClassName("retry")
    retry[0].classList.remove("hidden")
    splash[0].classList.add("hidden")
    squares[0].classList.remove("hidden")
    generateRandomSquaresDivs();
    squaresListener();
    restartMiniGame(true);
}


function restartMiniGame(bReset) {
    let squares = document.getElementsByClassName("square");
    for (let i = 0; i < squares.length; i++)
        squares[i].classList.remove("active-square")
    if (bReset)
        actualStreak[0].innerHTML = "0"
    let speed = document.getElementById("speed").value * 1000 + 300;
    let timer = document.getElementsByClassName("timer");
    let progressBar = document.getElementsByClassName("progress-bar")[0];
    timer[0].classList.remove("hidden");
    let width = 100;
    let speedBar = 10 * 1 / (speed / 100);
    if (id != null){
        clearInterval(id);
        id = null;
    }
    id = setInterval(frame, 10);
    function frame() {
        if (width <= 0) {
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].classList.contains("active-square")) {
                    squares[i].classList.add("endgame-square-active")
                } else {
                    squares[i].classList.add("endgame-square")
                }
            }
            clearInterval(id);
        } else {
            width -= speedBar;
            progressBar.style.width = width + '%';
        }
    }
    generateRandomSquares();
}


function activeDeactiveSquare(square) {
    if (square.classList.contains("active-square"))
        square.classList.remove("active-square")
    else
        square.classList.add("active-square")
}

function generateRandomSquares() {
    let max = 15;
    let min = 4;
    let randomNumber = Math.random() * (max - min) + min;
    let maxSquares = squares.length;
    // Get random squares unique
    let randomSquares = [];
    while (randomSquares.length < randomNumber) {
        let r = Math.floor(Math.random() * maxSquares);
        if (randomSquares.indexOf(r) === -1)
            randomSquares.push(r);
    }
    // Active random squares
    for (let i = 0; i < randomSquares.length; i++) {
        squares[randomSquares[i]].click();
    }
}

function generateRandomSquaresDivs() {
    // Create divs on colums divs
    for (let i = 0; i < quantity; i++) {
        const column = document.createElement("div");
        column.classList.add("column");
        document.getElementsByClassName("squares")[0].appendChild(column);
        // On each column create divs with class square and the quantity of rows
        for (let j = 0; j < quantity; j++) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("square");
            column.appendChild(newDiv);
        }
    }
}

function squaresListener() {
    let squares = document.getElementsByClassName("square");
    for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function () {
            let clickedSquare = squares[i]
            activeDeactiveSquare(clickedSquare)

            if (i - quantity >= 0)
                activeDeactiveSquare(squares[i - quantity])

            if (i + quantity <= squares.length - 1)
                activeDeactiveSquare(squares[i + quantity])

            if (i % quantity != 0)
                activeDeactiveSquare(squares[i - 1])

            if ((i + 1) % quantity != 0)
                activeDeactiveSquare(squares[i + 1])

            if (document.getElementsByClassName("active-square").length == squares.length) {
                actualStreak[0].innerHTML = parseInt(actualStreak[0].innerHTML) + 1;
                clearInterval(id);
                if (parseInt(actualStreak[0].innerHTML) > parseInt(maxStreak[0].innerHTML)) {
                    maxStreak[0].innerHTML = actualStreak[0].innerHTML;
                }
                restartMiniGame(false)
            }
        });
    };
}

document.getElementById('speed').addEventListener('input', function (ev) {
    document.querySelector('.speed_value').innerHTML = ev.target.value + 's';
});

let hardness = document.getElementsByClassName("hardness");
for (let i = 0; i < hardness.length; i++) {
    hardness[i].addEventListener("click", function () {
        for (let j = 0; j < hardness.length; j++) {
            hardness[j].classList.remove("active");
        }
        hardness[i].classList.add("active");
        quantity = parseInt(hardness[i].value)
        // Remove all elements with class column
        let columns = document.getElementsByClassName("column");
        while (columns.length > 0) {
            columns[0].parentNode.removeChild(columns[0]);
        }
        generateRandomSquaresDivs();
        squaresListener();
        maxStreak[0].innerHTML = "0"
        clearInterval(id);
        restartMiniGame(true);
    });
}

for (let i = 0; i < rows.length; i++) {
    if (rows[i].classList.contains("active")) {
        quantity = parseInt(rows[i].value)
    }
}

