const CUBEWITH = 50;
const CUBEHEIGHT = 50;
const GAMETIME = 60;
const POINTSPERCUBE = 1;
const CUBECOLORS = ['red', 'green', 'cyan', 'beige', 'blue'];

let rowCount = 1;
let popupWindowEl = document.querySelector(".popupWindow");
let resultsTableEl = document.querySelector(".results_table");
let usersScoreEl = document.querySelector(".scoreInModal");
let nameInputEl = document.querySelector(".usersInputName");
let startButtonEl = document.querySelector(".start");
let pauseButtonEl = document.querySelector(".pause");
let restartButtonEl = document.querySelector(".new-game");
let playgroundEl = document.querySelector(".playground");
let timeBoardEl = document.querySelector(".timeboard");
let scoreInModalEl = document.querySelector(".scoreInModal");
let saveButtonEl = popupWindowEl.querySelector(".save");
let nameErrorEl = popupWindowEl.querySelector(".name-error");
let scoreBoardEl = document.querySelector(".scoreboard");
let gameTimeInterval = null;
let score = 0;
let gameIsPaused = false;

initEventListeners();

function initEventListeners() {
    startButtonEl.addEventListener('click', startGame);
    restartButtonEl.addEventListener('click', restartGame);
    saveButtonEl.addEventListener('click', saveScore);
    pauseButtonEl.addEventListener('click', switchPauseStatus);
}

function startGame() {
    startButtonEl.classList.add("d-none");
    pauseButtonEl.classList.remove("d-none");
    restartButtonEl.removeAttribute("disabled");
    startButtonEl.setAttribute("disabled", true);
    showCubes(10);
    startCountdown();
}

function restartGame() {
    if(gameIsPaused) switchPauseStatus();
    resetGame();
    startGame();
}

function resetGame() {
    pauseButtonEl.classList.add("d-none");
    startButtonEl.removeAttribute("disabled");
    restartButtonEl.setAttribute("disabled", true);
    score = 0;
    scoreBoardEl.innerHTML = score;
    timeBoardEl.innerHTML = "01:00";
    playgroundEl.innerHTML = "";
    if(gameTimeInterval) stopCountdown();
}

function switchPauseStatus() {
    gameIsPaused = !gameIsPaused;
    if(gameIsPaused) pauseButtonEl.innerHTML = "PLAY"; 
    else pauseButtonEl.innerHTML = "PAUSE"; 
}

// create a number of cubes (defined in showCubes(10))
function showCubes(amount) {
    for(let i = 1; i <= amount; i++) {
        let cube =  createCube();
        showCube(cube);
    }
}

// create a cube (HTML element with the random color from CUBECOLORS) 
    // 1) Create HTML element via JS
    // 2) set width and height for this element
    // 3) set random Color to background for this element
    // 4) set position absolute      
function createCube() {
    let cube = document.createElement("div");
    cube.style.cssText = `width:${CUBEWITH}px;height:${CUBEHEIGHT}px;position:absolute`;
    cube.style.backgroundColor = CUBECOLORS[getRandomInt(0, CUBECOLORS.length)];
    cube.addEventListener("click", function() {
        score += POINTSPERCUBE;
        showNewScore();
        cube.remove();
        showCubes(getRandomInt(0,3));
        if(!playgroundEl.querySelector("div")) {
            showCubes(5);
        }
    });
    return cube;
}

//update the score
function showNewScore() {
    scoreBoardEl.innerHTML = score;
}

// 1) Get width and height of playground
// 2) Get random width from 0 to width and get random height from 0 to height
function showCube(cube) {
    let width = playgroundEl.offsetWidth;
    let height = playgroundEl.offsetHeight;    
    cube.style.left = getRandomWidth() + "px";
    cube.style.top = getRandomHeight() + "px";
    playgroundEl.append(cube);

    function getRandomWidth() {
        let max = width - CUBEWITH;
        return getRandomInt(0, max);
    }

    function getRandomHeight() {
        let max = height - CUBEHEIGHT;
        return getRandomInt(0, max);
    }
}

function startCountdown() {
    let currentTime = GAMETIME;
    // 1) set currentTime - 1 second
    // 2) showNewTime()
    // 3) time over leads to showModalWindow()
    gameTimeInterval = setInterval(function() {
        if(!gameIsPaused) {
            currentTime -=  1;
            showNewTime();
            if(currentTime === 0) {
                stopCountdown();
                showModalWindow();
            }
        }
    }, 1000);

    // adjust format for seconds display
    function showNewTime() {
        let seconds = currentTime < 10 ? `0${currentTime}` : currentTime;
        timeBoardEl.innerHTML = `00:${seconds}`;
    }
}

function stopCountdown () {
    clearInterval(gameTimeInterval);
    gameTimeInterval = null;
}

function showModalWindow() {
    popupWindowEl.classList.add("modal-active");
    scoreInModalEl.innerHTML = score;
}

function closeModalWindow() {
    popupWindowEl.classList.remove("modal-active");
    nameErrorEl.classList.add("d-none");
    nameInputEl.value = "";
    startButtonEl.classList.remove("d-none");
}
// check and save the game result and the name check
function saveScore() {
    let playerName = nameInputEl.value;
    if(!playerName) {
        nameErrorEl.classList.remove("d-none");
    } else {
        closeModalWindow();
        addToScore(playerName, score);
        resetGame();
    }
}

// insert game results in the table name/score
function addToScore(name, score) {
    let row = resultsTableEl.insertRow(rowCount);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    cell1.innerHTML = name;
    cell2.innerHTML = score;
    rowCount++;    
}

// common function for all random number utilities
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}