export { gameStart };
const GRID_SIZE = 5;
const CELL_SIZE = 8;
const CELL_GAP = 1.3;
const container = document.querySelector(".container");
const gameBoard = document.querySelector(".grid-container");
const gameTable = document.querySelector(".game-table-container");
const scoreDisplay = document.getElementById("displayed_score");
const bestScoreDisplay = document.getElementById("displayed_best_score");
const timeDisplay = document.getElementById("displayed_time_score");
var gameStart = true;

export default class Grid {
  #cells;

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}rem`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}rem`);
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
  }

  get cells() {
    return this.#cells;
  }

  get cellsByRow() {
    return this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByColumn() {
    return this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get emptyCells() {
    return this.cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
    return this.emptyCells[randomIndex];
  }
}

class Cell {
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.x;
    this.#tile.y = this.y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.x;
    this.#mergeTile.y = this.y;
  }

  canAccept(tile) {
    return (
      this.#tile == null ||
      (this.#mergeTile == null && this.#tile.value === tile.value)
    );
  }

  mergeTiles() {
    if (this.#tile == null || this.mergeTile == null) return;
    this.#tile.value = this.tile.value + this.mergeTile.value;
    if (this.#tile.value == 2048) {
      gameStart = false;
      fetch("/api/v1/record", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Win!",
        }),
      })
        .then(function (response) {
          if (response.ok) {
            console.log("Click was recorded");
            return;
          }
          throw new Error("Request failed.");
        })
        .catch(function (error) {
          console.log(error);
        });
      youWin();
    }

    this.#mergeTile.remove();
    this.#mergeTile = null;
  }
}

function createCellElements(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}

export function youWin() {
  const gameOver = document.createElement("div");
  gameOver.classList.add("you-lose-or-win-window");
  const gameOverParagraph = document.createElement("p");
  gameOverParagraph.classList.add("you-win-text");
  const node = document.createTextNode("You win!");
  gameOverParagraph.appendChild(node);
  gameOver.appendChild(gameOverParagraph);
  gameBoard.append(gameOver);
  setTimeout(function () {
    createScoreboard();
  }, 1000);
}

function createScoreboard() {
  const playerScoreModal = document.createElement("dialog");
  container.append(playerScoreModal);
  playerScoreModal.classList.add("player-modal");
  playerScoreModal.show();
  const playerScoreDiv = document.createElement("div");
  playerScoreDiv.classList.add("player-score-container");
  playerScoreModal.append(playerScoreDiv);

  const scoreBoardText = document.createElement("h3");
  scoreBoardText.innerHTML = "Scoreboard";
  playerScoreDiv.append(scoreBoardText);

  var table = document.createElement("table");

  var tr = document.createElement("tr");

  var th1 = document.createElement("th");
  var th2 = document.createElement("th");

  var text1 = document.createTextNode("Player");
  var text2 = document.createTextNode("Score");

  th1.appendChild(text1);
  th2.appendChild(text2);

  tr.appendChild(th1);
  tr.appendChild(th2);

  table.appendChild(tr);

  fetch("/api/v1/record", { method: "GET" })
    .then(function (response) {
      if (response.ok) return response.json();
      throw new Error("Request failed.");
    })
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        var row = table.insertRow(i + 1);
        row.insertCell(0).innerHTML = data[i].username;
        row.insertCell(1).innerHTML = data[i].time;
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  const tableContainer = document.createElement("div");
  tableContainer.classList.add("table-container");
  playerScoreDiv.appendChild(tableContainer);
  tableContainer.appendChild(table);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  playerScoreDiv.appendChild(buttonContainer);

  var buttonNewGame = document.createElement("a");
  buttonNewGame.innerHTML = "New Game";
  buttonNewGame.classList.add("restart-button", "margin2");
  playerScoreDiv.appendChild(buttonNewGame);
  buttonNewGame.addEventListener("click", function () {
    window.location.reload();
  });
}
