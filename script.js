const easyBoard = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  // 他の行も同様に設定
];

const mediumBoard = [
  // 中級の数独盤面
];

const hardBoard = [
  // 上級の数独盤面
];

function startGame() {
  const level = document.getElementById('level').value;
  let board;
  if (level === 'easy') board = easyBoard;
  else if (level === 'medium') board = mediumBoard;
  else if (level === 'hard') board = hardBoard;
  
  createBoard(board);
}

function createBoard(board) {
  const boardContainer = document.getElementById('sudoku-board');
  boardContainer.innerHTML = '';
  
  board.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = document.createElement('input');
      cell.type = 'number';
      cell.min = 1;
      cell.max = 9;
      cell.classList.add('cell');
      if (cellValue) {
        cell.value = cellValue;
        cell.disabled = true;
      }
      boardContainer.appendChild(cell);
    });
  });
}
