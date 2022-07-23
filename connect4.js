// Connect Four: Player 1 and 2 alternate turns. On each turn, a piece is dropped down a column until a player gets four-in-a-row (horiz, vert, or diag) or until board fills (tie).

// Make the game a class.
class Game {
  constructor(p1, p2, height = 6 , width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  // Make JS board.
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  // Make HTML board.
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    // Make clickable top row.
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener('click', this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // Make main part of board.
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
    }
  }

  // Given column x, return top empty y (null if filled).
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  // Place piece into board.
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  // Announce end of game.
  endGame(msg) {
    alert(msg);
    const top = document.querySelector('#column-top');
    top.removeEventListener('click', this.handleGameClick);
  }

  // Click column to play piece.
  handleClick(evt) {
    // Get x from ID of clicked cell.
    const x = +evt.target.id;

    // Get next spot in column (if none, ignore click).
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // Place piece in board and add to HTML table.
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // Check for a tie.
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tied!!!');
    }
  
    // Check for a winner.
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} player won the game!!!`);
    }
  
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  // Check cell by cell for a winning condition.
  checkForWin() {
    // Check for four cells in a row matching current player color. Return true if all four coordinates are legal and all match current player color. 
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Checklist for the four winning conditions.
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // Find a winner if any condition is met.
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1, p2);
});