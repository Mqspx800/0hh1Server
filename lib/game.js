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
  return row.filter(n => n === num).length;
};

const areIdentical = (arr1, arr2) => {
  areIden = arr1.join("") === arr2.join("");
  unfill =
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
  return numberOfvalue(rowOrCol, value) < rowOrCol.length / 2;
};

const rows = board => {
  return board;
};

const columns = board => {
  //init columns
  cols = new Array(board[0].length)
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
  const columnCheckPass = valueAllowed(columns[columnIndex], value);
  return rowsCheckPass && columnCheckPass;
};

const numSquaresFilled = (board, correctOnly = false) => {
  if(correctOnly)
  const squareFilledCorrect = 

  const squareFilledCount = [].concat
    .apply([], board)
    .join("")
    .match(/(1|2)/g).length

  return squareFilledCount
};

const percentageFilled = board => {
  //to be implemented
};

module.exports = {
  threeOrMoreInARow,
  numberOfvalue,
  areIdentical,
  isBoardFull,
  duplicatedCols,
  duplicatedRow,
  isPossibleMove,
  numSquaresFilled,
  percentageFilled,
  valueAllowed,
  columns
};
