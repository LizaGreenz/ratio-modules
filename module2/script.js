import Grid from "./Grid.js";
import Tile from "./Tile.js";
import { gameStart } from "./Grid.js";

var timeScore = 0;
var seconds = 0;
let pDownX = null;
let pDownY = null;

const gameBoard = document.querySelector(".grid-container");
const gameTable = document.querySelector(".game-table-container");
const scoreDisplay = document.getElementById("displayed_score");
const bestScoreDisplay = document.getElementById("displayed_best_score");
const timeDisplay = document.getElementById("displayed_time_score");
const newGameButton = document.querySelector(".restart-button");
const container = document.querySelector(".container");

function createModalDialog() {
  const playerNameModal = document.createElement("dialog");
  container.append(playerNameModal);
  playerNameModal.classList.add("player-modal");
  const playerInputDiv = document.createElement("div");
  playerInputDiv.classList.add("player-input-container");
  playerNameModal.appendChild(playerInputDiv);
  const playerInput = document.createElement("input");
  playerInput.classList.add("player-input");
  playerInput.setAttribute("type", "text");
  playerInput.required;
  playerInput.action = "/api/v1/record/";
  playerInput.method = "POST";
  playerInputDiv.appendChild(playerInput);
  playerNameModal.show();
  const submitButton = document.createElement("button");
  playerInputDiv.appendChild(submitButton);
  submitButton.classList.add("submit-button");
  submitButton.innerHTML = "Play!";
  submitButton.addEventListener("click", function () {
    fetch("api/v1/record", { method: "POST" })
      .then(function (response) {
        if (response.ok) {
          console.log("Score was recorded");
          return;
        }
        throw new Error("Request failed.");
      })
      .catch(function (error) {
        console.log(error);
      });
    playerNameModal.close();
    timeScore = setInterval(incrementSeconds, 1000);
    setupInput();
    setupPointerInput();
  });
}

createModalDialog();

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

window.onload = () => {
  if (localStorage.getItem("bestScore") == null) {
    bestScoreDisplay.innerHTML = 0;
  } else {
    bestScoreDisplay.innerHTML = localStorage.getItem("bestScore");
  }
};

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

function setupPointerInput() {
  gameBoard.addEventListener("pointerdown", handlePointerDown, false);
  gameBoard.addEventListener("pointermove", handlePointerMove, false);
}

newGameButton.addEventListener("click", function () {
  localStorage.setItem("bestScore", scoreDisplay.innerHTML);
  window.location.reload();
});

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;

    default:
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (gameStart == false) {
    gameBoard.removeEventListener("pointerdown", handlePointerDown);
    gameBoard.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("keydown", handleInput);
    clearInterval(timeScore);
  }

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    youLose();
    return;
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

function handlePointerDown(evt) {
  pDownX = evt.clientX;
  pDownY = evt.clientY;
}

function handlePointerMove(evt) {
  if (!pDownX || !pDownY) {
    return;
  }

  var xUp = evt.clientX;
  var yUp = evt.clientY;

  var xDiff = pDownX - xUp;
  var yDiff = pDownY - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      if (!canMoveLeft()) {
        setupPointerInput();
        return;
      }
      moveLeft();
      /* right swipe */
    } else {
      if (!canMoveRight()) {
        setupPointerInput();
        return;
      }
      moveRight();
      /* left swipe */
    }
  } else {
    if (yDiff > 0) {
      if (!canMoveUp()) {
        setupPointerInput();
        return;
      }
      moveUp();
      /* down swipe */
    } else {
      if (!canMoveDown()) {
        setupPointerInput();
        return;
      }
      moveDown();
      /* up swipe */
    }
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  pDownX = null;
  pDownY = null;

  if (gameStart == false) {
    gameBoard.removeEventListener("pointerdown", handlePointerDown);
    gameBoard.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("keydown", handleInput);
    clearInterval(timeScore);
  }

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    youLose();
    return;
  }
}

function youLose() {
  const gameOver = document.createElement("div");
  gameOver.classList.add("you-lose-or-win-window");
  const gameOverParagraph = document.createElement("p");
  gameOverParagraph.classList.add("you-lose-text");
  const node = document.createTextNode("You lose!");
  gameOverParagraph.appendChild(node);
  gameOver.appendChild(gameOverParagraph);
  gameBoard.append(gameOver);
  var buttonLose = document.createElement("a");
  buttonLose.innerHTML = "Try again";
  buttonLose.classList.add("restart-button");
  gameOver.appendChild(buttonLose);
  clearInterval(timeScore);
  buttonLose.addEventListener("click", function () {
    localStorage.setItem("bestScore", scoreDisplay.innerHTML);
    window.location.reload();
  });
}

function incrementSeconds() {
  seconds += 1;
  timeDisplay.innerHTML = seconds;
}
