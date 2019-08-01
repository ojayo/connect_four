/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < WIDTH; i++) {
    board[i] = []; // create an array for the rows
    for (let j = 0; j < HEIGHT; j++) {
      board[i][j] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "board" variable from the item in HTML w/ID of "board"
  let boardNode = document.getElementById("board");
  // create a table row element and calling it "top"
  let top = document.createElement("tr");
  // add attribute "id" and calling it "column-top"
  top.setAttribute("id", "column-top");
  // add an event listener
  top.addEventListener("click", handleClick);

  // create the clickable top row
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  boardNode.append(top);

  // create the playing table of td and tr elements
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); // create table rows
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); //  create cell in each row
      cell.setAttribute("id", `${y}-${x}`); // assigning unique id according to index of td element
      row.append(cell);
    }
    boardNode.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // goes up the column to look for the next spot to land

  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) { // x is row coordinate
  //  make a div and insert into correct table cell
  let cellDiv = document.createElement("div");
  let targetCell = document.getElementById(`${y}-${x}`);

  targetCell.appendChild(cellDiv);
  cellDiv.classList.add("piece");
  if (currPlayer == 1) {
    cellDiv.classList.add("p1");
  } else {
    cellDiv.classList.add("p2");
  }
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  (currPlayer == 1) ? currPlayer = 2 : currPlayer = 1;
  // switch players
  // switch currPlayer 1 <-> 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  } // will it ever return false?
}

makeBoard();
makeHtmlBoard();
