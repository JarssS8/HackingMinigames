console.log("Hello World!");

let shapes = [
    "square",
    "circle",
    "triangle",
    "rectangle",
]

let solutions = {
    "shape": "shape",
    "shapeText": "shape text",
    "shapeColor": "shape color",
    "shapeTextBackgroundColor": "shape text background color",
    "textColor": "text color",
    "colorTextBackgroundColor": "color text background color",
    "numberColor": "number color",
    "backgroundColor": "background color",
}

let solutionTxt = ""

let timeout = null;
let timeoutMinigame = null;

function playBtnMinigame() {
    let splash = document.getElementsByClassName("splash")
    let squares = document.getElementsByClassName("squares")
    let timer = document.getElementsByClassName("timer")
    if (squares.length == 0) {
        console.log("No squares found");
        return;
    }
    splash[0].classList.add("hidden");
    squares[0].classList.remove("hidden");
    timer[0].classList.add("hidden");
    againButton();
}

function startGame() {
    let hardness = document.getElementsByClassName("hardness");
    let numbers = 4;
    let sols = 2;
    for (let i = 0; i < hardness.length; i++) {
        if (hardness[i].classList.contains("active")) {
            let value = hardness[i].value;
            let valuesArr = value.split(" ");
            numbers = parseInt(valuesArr[0]);
            sols = parseInt(valuesArr[1]);
        }
    }

    createGuessNumbers(numbers, sols);
}

function getRandomNumbers(num, max = 11) {
    // get random numbers between 0 and max both included and different
    let randomKeys = [];
    let randomNumbers = [];
    let randomNumberGuess = {};
    for (let i = 0; i < num; i++) {
        let randomKey = Math.floor(Math.random() * max);
        if (randomKeys.includes(randomKey)) {
            i--;
            continue;
        }
        randomKeys.push(randomKey);

        let randomNumber = Math.floor(Math.random() * 14) + 1;
        if (randomNumbers.includes(randomNumber)) {
            i--;
            continue;
        }
        randomNumbers.push(randomNumber);

        randomNumberGuess[randomKey] = randomNumber;
    }

    console.log(randomKeys);
    console.log(randomNumbers);
    console.log(randomNumberGuess);
    return randomNumberGuess;
}


function createGuessNumbers(numberGuess, solutions) {
    let randomNumbers = getRandomNumbers(numberGuess);
    console.log("createGuessNumbers");
    let guessNumbers = document.getElementsByClassName("guess_number");
    for (const [key, value] of Object.entries(randomNumbers)) {
        console.log(key, value);
        guessNumbers[key].classList.remove("hidden");
        guessNumbers[key].innerHTML = value;
    }

    // create timer to wait 2 seconds
    timeout = setTimeout(() => {
        for (const [key, value] of Object.entries(randomNumbers)) {
            guessNumbers[key].classList.add("hidden");
            guessNumbers[key].innerHTML = "";
        }
        let timer = document.getElementsByClassName("timer");
        timer[0].classList.remove("hidden");
        let squaresValues = createSquares();
        changeGuessText(randomNumbers, solutions, squaresValues);
        let speed = document.getElementById('speed').value;
        let progressBar = document.getElementsByClassName("progress-bar")[0];
        progressBar.style.transitionDuration = speed + 's';
        progressBar.style.width = '0px';
        speed *= 1000;

        timeoutMinigame = setTimeout(() => {
            let actualStreak = document.getElementsByClassName("actual_streak");
            actualStreak[0].innerHTML = 0;
            let correctSolution = document.getElementsByClassName("correct_solution");
            correctSolution[0].classList.remove("hidden");
            correctSolution[0].innerHTML = "OH OH OH, WRONG ANSWER!\nCorrect answer is: " + solutionTxt;
        }, speed);

    }, 4000);
}

let hardness = document.getElementsByClassName("hardness");
for (let i = 0; i < hardness.length; i++) {
    hardness[i].addEventListener("click", function () {
        for (let j = 0; j < hardness.length; j++) {
            hardness[j].classList.remove("active");
        }
        hardness[i].classList.add("active");
        let splash = document.getElementsByClassName("splash")
        let squares = document.getElementsByClassName("squares")
        let result = document.getElementsByClassName("result")
        let timer = document.getElementsByClassName("timer")
        if (squares.length == 0) {
            console.log("No squares found");
            return;
        }
        clearTimeout(timeout);
        splash[0].classList.remove("hidden");
        squares[0].classList.add("hidden");
        result[0].classList.add("hidden");
        timer[0].classList.add("hidden");
    });
}

let input = document.getElementById("solution_input");
input.addEventListener("keypress", function (event) {
    let maxStreak = document.getElementsByClassName("max_streak");
    let actualStreak = document.getElementsByClassName("actual_streak");
    if (event.key === "Enter") {
        event.preventDefault();

        if (input.value.trim().toLowerCase() == solutionTxt) {
            actualStreak[0].innerHTML = parseInt(actualStreak[0].innerHTML) + 1;
            if (parseInt(actualStreak[0].innerHTML) > parseInt(maxStreak[0].innerHTML)) {
                maxStreak[0].innerHTML = actualStreak[0].innerHTML;
            }
            clearTimeout(timeoutMinigame);
            againButton()
        } else {
            actualStreak[0].innerHTML = 0;
            let correctSolution = document.getElementsByClassName("correct_solution");
            correctSolution[0].classList.remove("hidden");
            correctSolution[0].innerHTML = "OH OH OH, WRONG ANSWER!\nCorrect answer is: " + solutionTxt;
        }
    }
});

document.getElementById('speed').addEventListener('input', function(ev){
    document.querySelector('.speed_value').innerHTML = ev.target.value + 's';
});

function againButton() {
    let guessNumbers = document.getElementsByClassName("guess_number");
    let shapesDivs = document.getElementsByClassName("shape");
    let topText = document.getElementsByClassName("top_text");
    let bottomText = document.getElementsByClassName("bottom_text");
    let numbers = document.getElementsByClassName("number");
    let cards = document.getElementsByClassName("cards");
    let results = document.getElementsByClassName("result");
    let correctSolution = document.getElementsByClassName("correct_solution");
    for (let i = 0; i < guessNumbers.length; i++) {
        guessNumbers[i].innerHTML = "";
    }
    for (let i = 0; i < shapesDivs.length; i++) {
        shapesDivs[i].classList = "shape hidden";
        topText[i].classList = "top_text hidden";
        bottomText[i].classList = "bottom_text hidden";
        numbers[i].classList = "number hidden";
        guessNumbers[i].classList = "guess_number";
        cards[i].classList = "cards";
    }
    let progressBar = document.getElementsByClassName("progress-bar")[0];
    progressBar.style.transitionDuration = '0s';
    progressBar.style.width = '100%';
    results[0].classList = "result hidden";
    correctSolution[0].classList = "correct_solution hidden";
    solutionTxt = "";
    input.value = "";
    startGame();
}


function changeGuessText(randomNumbers, numberGuess, squaresValues) {
    let keys = Object.keys(randomNumbers);
    let guessOptions = [];
    let guessText = ""

    for (let i = 0; i < numberGuess; i++) {
        let key = keys[Math.floor(Math.random() * keys.length)];
        if (guessOptions.includes(key)) {
            i--;
            continue;
        }
        guessOptions.push(key);
    }
    for (let i = 0; i < guessOptions.length; i++) {
        let key = guessOptions[i];
        let solutionsKeys = Object.keys(solutions);
        let propperty = solutionsKeys[Math.floor(Math.random() * solutionsKeys.length)];
        let proppertyTxt = solutions[propperty];
        let value = squaresValues[key][propperty];
        solutionTxt = solutionTxt + " " + value;
        if (guessText.length > 0) {
            guessText = guessText + " and " + proppertyTxt + " (" + randomNumbers[key] + ")";
        } else {
            guessText = "Enter the " + proppertyTxt + " (" + randomNumbers[key] + ")";
        }
    }
    solutionTxt = solutionTxt.trim().toLowerCase();
    let result_guess = document.getElementsByClassName("result_guess");
    result_guess[0].innerHTML = guessText;
    console.log(solutionTxt);
}



function createSquares() {
    let cards = document.getElementsByClassName("cards")
    let shapesDivs = document.getElementsByClassName("shape")
    let topText = document.getElementsByClassName("top_text")
    let bottomText = document.getElementsByClassName("bottom_text")
    let numbers = document.getElementsByClassName("number")
    let squaresValues = {};
    for (let i = 0; i < cards.length; i++) {
        let colors = [
            "red",
            "green",
            "blue",
            "yellow",
            "purple",
            "orange",
            "white",
            "black",
        ]
        let colorsCard = colors.sort((a, b) => 0.5 - Math.random());
        let card = cards[i];
        let shape = shapes[Math.floor(Math.random() * shapes.length)];
        let shapeText = shapes[Math.floor(Math.random() * shapes.length)];
        while (shapeText == shape) {
            shapeText = shapes[Math.floor(Math.random() * shapes.length)];
        }
        let bgColor = colorsCard.pop();
        let textColor = colorsCard.pop();

        while (textColor == bgColor) {
            textColor = colors[Math.floor(Math.random() * colors.length)];
        }

        let shufflText = Math.floor(Math.random() * 2);
        let shapeTextColor = colors.pop()
        let colorTextColor = colors.pop()
        if (shufflText == 0) {
            topText[i].innerHTML = shapeText;
            topText[i].classList.add(shapeTextColor);
            bottomText[i].innerHTML = textColor;
            bottomText[i].classList.add(colorTextColor);
            if (shapeTextColor == "black") {
                topText[i].classList.add("white_stroke");
            } else {
                topText[i].classList.add("black_stroke");
            }
            if (colorTextColor == "black") {
                bottomText[i].classList.add("white_stroke");
            } else {
                bottomText[i].classList.add("black_stroke");
            }
        } else {
            topText[i].innerHTML = textColor;
            topText[i].classList.add(colorTextColor);
            bottomText[i].innerHTML = shapeText;
            bottomText[i].classList.add(shapeTextColor);
            if (colorTextColor == "black") {
                topText[i].classList.add("white_stroke");
            } else {
                topText[i].classList.add("black_stroke");
            }
            if (shapeTextColor == "black") {
                bottomText[i].classList.add("white_stroke");
            } else {
                bottomText[i].classList.add("black_stroke");
            }
        }

        let numberTextColor = colors.pop()
        let shapeColor = colors.pop()

        card.classList.add("bg-" + bgColor);
        // create div into card
        shapesDivs[i].classList.add(shape, shape + "-" + shapeColor);
        let number = Math.floor(Math.random() * 10);
        numbers[i].innerHTML = number;
        numbers[i].classList.add(numberTextColor);
        if (numberTextColor == "black") {
            numbers[i].classList.add("white_stroke");
        } else {
            numbers[i].classList.add("black_stroke");
        }


        topText[i].classList.remove("hidden");
        bottomText[i].classList.remove("hidden");
        numbers[i].classList.remove("hidden");
        shapesDivs[i].classList.remove("hidden");


        squaresValues[i] = {
            "shape": shape,
            "shapeText": shapeText,
            "shapeColor": shapeColor,
            "shapeTextBackgroundColor": shapeTextColor,
            "textColor": textColor,
            "colorTextBackgroundColor": colorTextColor,
            "numberColor": numberTextColor,
            "backgroundColor": bgColor,
        }
    }
    let result = document.getElementsByClassName("result");
    result[0].classList.remove("hidden");
    let resultText = document.getElementsByClassName("result_text");
    resultText[0].focus();
    return squaresValues;
}