// ==== SELECTORS =====
const colorDivs = document.querySelectorAll("#colorContainer div");
const colorContainer = document.querySelector("#colorContainer");
const gameContainer = document.querySelector("#gameContainer");
const historyContainer = document.querySelector("#historyContainer");
const titles = document.querySelector("#titles");
const menuColors = document.querySelector("#menuColors");

const btnStart = document.querySelector("#btnStart");
const btnSubmitCode = document.querySelector("#btnSubmitCode");
const btnReset = document.querySelector("#btnReset");
const menu = document.querySelector("#menu");

// ==== Game variable ====
let secretCode;
let possibleColor = ["blue", "red", "yellow", "green", "indigo", "cyan", "orange", "black"];
let attempts;

// ==== Events ====
colorDivs.forEach((el) => {
    el.addEventListener("click", () => {
        el.style.backgroundColor = nextPossibleColor(el)
    })
})

btnStart.addEventListener("click", (e) => {
    e.preventDefault();

    gameContainer.classList.remove("hidden");
    menu.classList.add("hidden");
    menuColors.classList.add("hidden");

    secretCode = secretCodeArr();
    attempts = 0;

    randomUserColorCode();
})

btnSubmitCode.addEventListener("click", (e) => {
    e.preventDefault();

    // function pour check le code
    if (isSecretCode(getUserColorCode())) { //truc quand code trouvé
        youWin();

    } else { // génère l'historique 
        // avec le numéro d'essai et l'indice de score
        attempts++
        let hint = getHintColor();
        logUserColorCode(hint);

        // Check gameOver
        isGameOver();
    }
})

btnReset.addEventListener("click", (e) => {
    e.preventDefault();

    while (historyContainer.firstChild) {
        historyContainer.removeChild(historyContainer.firstChild);
    }

    gameContainer.classList.add("hidden");
    menu.classList.remove("hidden");
    menuColors.classList.remove("hidden");

    btnReset.classList.add("hidden");
    btnSubmitCode.classList.remove("hidden");

    titles.removeChild(titles.lastChild)
})

// ==== Game Start
function gameStart() {

    let secretCode = secretCodeArr()
}


// ==== Define a random color code
function secretCodeArr() {

    let arrayColorCode = [];

    for (let i = 0; i < 4; i++) {
        arrayColorCode.push(possibleColor[Math.floor(Math.random() * possibleColor.length)]);
    }
    return arrayColorCode
}

// ==== Check if the user-code is the Secret-Code
function isSecretCode(propositionArr) {
    if (secretCode.join("") == propositionArr.join("")) return true;
    else return false;
}

// ==== Alternate COLORS
function nextPossibleColor(element) {

    let tempIndex = possibleColor.indexOf(element.style.backgroundColor)

    if (tempIndex === possibleColor.length - 1) {
        tempIndex = -1
    }

    element.style.backgroundColor = possibleColor[tempIndex + 1];

}

// ==== Get user color in an array
function getUserColorCode() {

    let userColorCode = [];

    colorDivs.forEach((div) => {
        userColorCode.push(div.style.backgroundColor);
    })
    return userColorCode;
}

// ==== Log the user code history
function logUserColorCode(array) {
    let userColorCode = getUserColorCode();

    const logContainer = document.createElement("div");
    const userColorContainer = document.createElement("div");
    const tryNumSpan = document.createElement("p");

    // Number of tries in log BEFORE the user container ColorCode
    tryNumSpan.append(`${attempts}  )`);
    logContainer.append(tryNumSpan);

    // User ColorCode to container
    userColorCode.forEach((color) => {
        const newColorDiv = document.createElement("div");
        newColorDiv.classList.add("colorDiv");

        newColorDiv.style.backgroundColor = color;
        userColorContainer.append(newColorDiv);
    })

    // User container to LOG
    logContainer.append(userColorContainer);

    const hintSpan = document.createElement("p");

    // HINT after the user Container
    hintSpan.append(`Right: ${array[0]}\n Misplaced: ${array[1]}`);
    logContainer.append(hintSpan);

    // Append the whole LOG
    historyContainer.append(logContainer);
}

// ==== Determine l'indice score à donner ====
function getHintColor() {
    let userColorCode = getUserColorCode();
    let rightColor = 0;
    let misplacedColor = 0;

    for (let i = 0; i < userColorCode.length; i++) {
        if (secretCode[i] === userColorCode[i]) {
            rightColor++;

        } else {
            if (secretCode.includes(userColorCode[i])) {
                misplacedColor++;

                let allMatchedColor = [];
                let tempIndex = secretCode.indexOf(userColorCode[i]);

                while (tempIndex !== -1) {
                    allMatchedColor.push(tempIndex);
                    tempIndex = secretCode.indexOf(userColorCode[i], tempIndex + 1);
                }
                for (let j = 0; j < allMatchedColor.length; j++) {
                    if (userColorCode[allMatchedColor[j]] === secretCode[allMatchedColor[j]]) {
                        misplacedColor--
                    }
                }

            }
        }
    }
    return [rightColor, misplacedColor];
}

// ==== Game Over Check ====
function isGameOver() {
    if (attempts >= 12) {

        // show Secret Color Code
        for (let i = 0; i < secretCode.length; i++) {
            colorDivs[i].style.backgroundColor = secretCode[i];
        }

        btnSubmitCode.classList.add("hidden");
        btnReset.classList.remove("hidden");
        btnReset.innerText = "Try again !";
        btnReset.setAttribute("disabled", true);

        setTimeout(() => { btnReset.removeAttribute("disabled") }, 2500)

        const newH2 = document.createElement("h2");
        newH2.innerText = "Game Over";
        titles.append(newH2);
    }
}

// ==== you win ====
function youWin() {

    btnSubmitCode.classList.add("hidden");
    btnReset.classList.remove("hidden");
    btnReset.innerText = "Menu";
    btnReset.setAttribute("disabled", true);

    setTimeout(() => { btnReset.removeAttribute("disabled") }, 2500)

    const newH2 = document.createElement("h2");
    newH2.innerText = "Congratulations!";
    titles.append(newH2);
}

// ==== Random user color code ===
function randomUserColorCode() {
    for (let i = 0; i < colorDivs.length; i++) {
        colorDivs[i].style.backgroundColor = possibleColor[Math.floor(Math.random() * possibleColor.length)];
    }
}