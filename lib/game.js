const threeOrMoreInARow = rowOrCol => {
  const counts = rowOrCol.join("").match(/([1-2]|0)\1*/g) || [];
  const matches = [].concat
    .apply(
      [],
      counts.map((m, i) =>
        new Array(m.length).fill(m.match(/0/) ? null : m.length)
      )
    )
    .map((l, i) => (l > 2 ? i : null))
    .filter(l => l !== null);
  return matches;
};

const numberOfvalue = (row, num) => {
  return row ? row.filter(n => n === num).length : 0;
};

const areIdentical = (arr1, arr2) => {
  let areIden = arr1.join("") === arr2.join("");
  let unfill =
    arr1
      .concat(arr2)
      .join("")
      .match(/(0)\1*/) === null;
  return areIden && unfill;
};

const isBoardFull = board => {
  return ![].concat.apply([], board).includes(0);
};

const valueAllowed = (rowOrCol, value) => {
  // return value === 0
  //   ? true
  //   : numberOfvalue(rowOrCol, value) <= rowOrCol.length / 2;
  return value === 0 || numberOfvalue(rowOrCol, value) <= rowOrCol.length / 2;
};

const rows = board => {
  return board;
};

const columns = board => {
  //init columns
  let cols = new Array(board[0].length)
    .fill(0)
    .map(() => new Array(board.length).fill(0));
  for (let i = 0; i < board.length; i++) {
    for (let k = 0; k < board[i].length; k++) {
      cols[k][i] = board[i][k];
    }
  }
  return cols;
};

const duplicatedRow = board => {
  for (let i = 0; i < rows(board).length; i++) {
    for (let k = i + 1; k < board.length; k++) {
      if (areIdentical(board[i], board[k])) return [i, k];
    }
  }
  return null;
};

const duplicatedCols = board => {
  let target = columns(board);
  for (let i = 0; i < target.length; i++) {
    for (let k = i + 1; k < target.length; k++) {
      if (areIdentical(target[i], target[k])) return [i, k];
    }
  }
  return null;
};

const isPossibleMove = (board, rowIndex, columnIndex, value) => {
  const rowsCheckPass = valueAllowed(board[rowIndex], value);
  const columnCheckPass = valueAllowed(columns(board)[columnIndex], value);
  let boardTest = JSON.parse(JSON.stringify(board));
  boardTest[rowIndex][columnIndex] = value;
  const consecutiveRowCheck =
    threeOrMoreInARow(boardTest[rowIndex]).length === 0;
  const consecutiveColCheck =
    threeOrMoreInARow(columns(boardTest)[columnIndex]).length === 0;
  return (
    rowsCheckPass &&
    columnCheckPass &&
    consecutiveColCheck &&
    consecutiveRowCheck
  );
};

const culprits = board => {
  //construct array of squares coords repeat more than 3 times in row or column
  const culpritsSquare = board.map((row, y) => {
    return row.map((value, x) => {
      const checkTotalInRow = valueAllowed(board[y], value);
      const checkTotalInColumn = valueAllowed(columns(board)[x], value);
      if (!checkTotalInColumn || !checkTotalInRow) return { x, y };
      return null;
    });
  });
  let culpritsCoords = [].concat.apply(
    [],
    culpritsSquare.map(r => r.filter(v => v != null))
  );
  //construct array of consecutive 3
  let consecutives = board
    .map((r, y) => {
      return threeOrMoreInARow(r).map(x => {
        return { x, y };
      });
    })
    .concat(
      columns(board).map((c, x) => {
        return threeOrMoreInARow(c).map(y => {
          return { x, y };
        });
      })
    )
    .filter(c => c.length > 0);
  return culpritsCoords.concat([].concat.apply([], consecutives));
};

const numSquaresFilled = (board, correctOnly = false) => {
  let squareFilledCorrect = 0;
  if (correctOnly) {
    squareFilledCorrect = board.reduce((acc, row) => {
      return acc + threeOrMoreInARow(row).length;
    }, 0);
    squareFilledCorrect += columns(board).reduce((acc, cols, i) => {
      return acc + threeOrMoreInARow(cols).length;
    }, 0);
  }

  const squareFilled = [].concat
    .apply([], board)
    .join("")
    .match(/(1|2)/g);
  const squareFilledCount = squareFilled ? squareFilled.length : 0;

  return squareFilledCount - squareFilledCorrect;
};

const percentageFilled = board => {
  const totalSquares = [].concat.apply([], board).length;
  return (numSquaresFilled(board, true) / totalSquares).toFixed(2) * 100;
};

//get random number between 0-6
const getRandom = (max, min) => {
  max = Math.floor(max);
  min = Math.ceil(min);

  return Math.floor(Math.random() * (max - min) + min);
};

const fillBoard = (n = 6, solve = false) => {
  //init board
  let board = new Array(n).fill(0).map(() => new Array(n).fill(0));
  let i = 0;

  while (!isBoardFull(board)) {
    let x = getRandom(0, n);
    let y = getRandom(0, n);
    let num = getRandom(1, 3);
    if (isPossibleMove(board, y, x, num)) {
      board[y][x] = num;
    }
    if (i === 50 * n) {
      i = 0;
      board = new Array(n).fill(0).map(() => new Array(n).fill(0));
    }
    i++;
  }
  let [x, y] = [0, 0];
  if (!solve) {
    while (percentageFilled(board, false) > 25) {
      [y, x] = [getRandom(0, n), getRandom(0, n)];
      board[y][x] = 0;
    }
  }
  let locked = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (board[y][x] != 0) {
        locked.push({ x, y });
      }
    }
  }
  return { colsAndRows: board, locked };
};

module.exports = {
  threeOrMoreInARow,
  numberOfvalue,
  areIdentical,
  isBoardFull,
  duplicatedCols,
  duplicatedRow,
  numSquaresFilled,
  percentageFilled,
  valueAllowed,
  columns,
  fillBoard,
  culprits
};
