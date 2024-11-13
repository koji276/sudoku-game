const SIZE = 9;

// 数独の解答を生成する関数
function generateFullBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

  function isSafe(board, row, col, num) {
    // 同じ行、列、3x3ブロックに数字があるかチェック
    for (let i = 0; i < SIZE; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  }

  function fillBoard(board) {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === null) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              if (fillBoard(board)) return true;
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillBoard(board);
  return board;
}

// 配列をランダムにシャッフルする関数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// パズルを生成するために一部の数字を削除
function generatePuzzle(board, difficulty = 'easy') {
  const puzzle = board.map(row => [...row]);
  let attempts = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40;

  while (attempts > 0) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      attempts--;
    }
  }

  return puzzle;
}

// ゲームを開始し、新しいパズルを作成する
function startGame() {
  const level = document.getElementById('level').value;
  const fullBoard = generateFullBoard();
  const puzzle = generatePuzzle(fullBoard, level);
  createBoard(puzzle);
}

// 盤面を表示する関数
function createBoard(board) {
  const boardContainer = document.getElementById('sudoku-board');
  boardContainer.innerHTML = '';

  board.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = document.createElement('input');
      cell.type = 'number';
      cell.min = 0;
      cell.max = 9;
      cell.classList.add('cell');

      if (cellValue) {
        cell.value = cellValue;
        cell.disabled = true;
        cell.classList.add('locked'); // 確定セルとしてロック
        cell.addEventListener('click', () => {
          // クリックで背景色をトグル
          cell.classList.toggle('highlighted');
        });
      } else {
        cell.addEventListener('input', () => {
          if (cell.value === '0') {
            cell.value = '';
          }
        });
      }

      boardContainer.appendChild(cell);
    });
  });
}

