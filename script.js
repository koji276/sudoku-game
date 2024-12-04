const SIZE = 9;

// 確定した完全な解答を保持
let solutionBoard = [];

// 数独の解答を生成する関数
function generateFullBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

  function isSafe(board, row, col, num) {
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePuzzle(board, difficulty = 'easy') {
  const puzzle = board.map(row => [...row]);
  solutionBoard = board;
  let attempts = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : difficulty === 'hard' ? 45 : 40;

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


function startGame() {
  const level = document.getElementById('level').value;
  const fullBoard = generateFullBoard();
  const puzzle = generatePuzzle(fullBoard, level);
  createBoard(puzzle);
}

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
        cell.classList.add('locked');
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

// 解答をチェックする関数
function checkSolution() {
  const boardContainer = document.getElementById('sudoku-board');
  const inputs = boardContainer.getElementsByTagName('input');
  let isCorrect = true;

  // 各セルの値をチェック
  Array.from(inputs).forEach((input, index) => {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const value = parseInt(input.value, 10);

    // 入力が正しいか確認
    if (value !== solutionBoard[row][col]) {
      isCorrect = false;
      input.style.backgroundColor = '#f8d7da'; // 間違っているセルを赤くする
    } else {
      input.style.backgroundColor = ''; // 正しいセルは元の色
    }
  });

  // 結果を表示
  const resultContainer = document.getElementById('result');
  if (isCorrect) {
    resultContainer.textContent = '成功！';
    resultContainer.style.color = 'green';
  } else {
    resultContainer.textContent = '間違いがあります。もう一度確認してください。';
    resultContainer.style.color = 'red';
  }
}

let timerInterval; // タイマーのインターバルID
let elapsedTime = 0; // 経過時間（秒単位）

// タイマーを開始する関数
function startTimer() {
  elapsedTime = 0; // 経過時間をリセット
  const timerElement = document.getElementById('timer');
  timerElement.textContent = "Time: 0:00"; // タイマー表示を初期化

  // 1秒ごとにタイマーを更新
  timerInterval = setInterval(() => {
    elapsedTime++;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, 1000);
}

// タイマーを停止する関数
function stopTimer() {
  clearInterval(timerInterval); // タイマーの更新を停止
}

// ゲームの開始時にタイマーをスタートさせる
function startGame() {
  stopTimer(); // 以前のタイマーを停止
  startTimer(); // 新しいタイマーを開始

  const level = document.getElementById('level').value;
  const fullBoard = generateFullBoard();
  const puzzle = generatePuzzle(fullBoard, level);
  createBoard(puzzle);
}

// ゲームクリア時や終了時にタイマーを停止させる
function checkSolution() {
  const boardContainer = document.getElementById('sudoku-board');
  const inputs = boardContainer.getElementsByTagName('input');
  let isCorrect = true;

  Array.from(inputs).forEach((input, index) => {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const value = parseInt(input.value, 10);

    if (value !== solutionBoard[row][col]) {
      isCorrect = false;
      input.style.backgroundColor = '#f8d7da';
    } else {
      input.style.backgroundColor = '';
    }
  });

  const resultContainer = document.getElementById('result');
  if (isCorrect) {
    stopTimer(); // 正解時にタイマーを停止
    resultContainer.textContent = '成功！';
    resultContainer.style.color = 'green';
  } else {
    resultContainer.textContent = '間違いがあります。もう一度確認してください。';
    resultContainer.style.color = 'red';
  }
}
