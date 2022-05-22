const GRID_SIZE = 5;
const CELL_SIZE = 8;
const CELL_GAP = 1.3;
const gameBoard = document.querySelector(".grid-container");
const gameTable = document.querySelector(".game-table-container");
const scoreDisplay = document.getElementById("displayed_score");
const bestScoreDisplay = document.getElementById("displayed_best_score");
const timeDisplay = document.getElementById("displayed_time_score");
var score = 0;
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
      youWin();
    }
    let score = countScore(this.#tile.value);
    if (score > +bestScoreDisplay.innerHTML) {
      bestScoreDisplay.innerHTML = score;
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

function countScore(num) {
  score += num;
  scoreDisplay.innerHTML = score;
  return score;
}

function youWin() {
  const gameOver = document.createElement("div");
  gameOver.classList.add("you-lose-or-win-window");
  const gameOverParagraph = document.createElement("p");
  gameOverParagraph.classList.add("you-win-text");
  const node = document.createTextNode("You win!");
  gameOverParagraph.appendChild(node);
  gameOver.appendChild(gameOverParagraph);
  gameBoard.append(gameOver);
  const timeSpent = document.createElement("p");
  const timeSpentText = document.createTextNode(timeDisplay.innerHTML);
  timeSpent.appendChild(timeSpentText);
  timeSpent.classList.add("time-spent-text");
  gameOver.appendChild(timeSpent);
  var buttonLose = document.createElement("a");
  buttonLose.innerHTML = "New Game";
  buttonLose.classList.add("restart-button");
  gameOver.appendChild(buttonLose);

  buttonLose.addEventListener("click", function () {
    window.location.reload();
    scoreDisplay.innerHTML = "0";
  });
}
