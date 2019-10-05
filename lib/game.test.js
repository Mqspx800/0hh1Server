const {
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
  columns,
  fillBoard
} = require("./game");

xdescribe("threeOrMoreInARow", () => {
  const row = [0, 2, 1, 2, 2, 2];
  const col = [1, 1, 1, 0, 2, 2];
  const col1 = [0, 1, 1, 1, 2, 1];

  it("returns the indices of the wrongly placed values", () => {
    expect(threeOrMoreInARow(row)).toEqual([3, 4, 5]);
    expect(threeOrMoreInARow(col)).toEqual([0, 1, 2]);
    expect(threeOrMoreInARow(col1)).toEqual([1, 2, 3]);
  });
});

xdescribe("Number of value", () => {
  const row = [0, 2, 2, 2, 2, 1, 3];

  it("return the count of target number", () => {
    expect(numberOfvalue(row, 2)).toEqual(4);
    expect(numberOfvalue(row, 0)).toEqual(1);
    expect(numberOfvalue(row, 1)).toEqual(1);
  });
});

xdescribe("Are identical", () => {
  it("return true if both value and position of value are identical", () => {
    expect(areIdentical([1, 1, 2], [1, 1, 2])).toEqual(true);
  });

  it("return false if there is difference in the same indice", () => {
    expect(areIdentical([1, 2, 2], [1, 1, 2])).toEqual(false);
  });

  it("return false if there is unfilled value in the array", () => {
    expect(areIdentical([1, 0, 2, 2], [1, 0, 2, 2])).toEqual(false);
  });
});

xdescribe("isBoardFull", () => {
  const fullBoard = [[1, 2, 1, 2], [1, 1, 2, 2], [2, 2, 1, 1], [2, 1, 2, 1]];

  const board = [[1, 2, 1, 2], [1, 1, 2, 2], [2, 0, 1, 1], [2, 1, 2, 1]];

  it("returns true if the board is full", () => {
    expect(isBoardFull(fullBoard)).toBe(true);
  });

  it("returns false if the board is not full", () => {
    expect(isBoardFull(board)).toBe(false);
  });
});

xdescribe("duplicatedRow", () => {
  const duplicated = [
    [1, 1, 1, 2, 2, 1],
    [1, 1, 1, 2, 2, 1],
    [1, 1, 1, 2, 1, 1],
    [1, 1, 1, 2, 2, 2]
  ];
  const noDuplicated = [
    [1, 1, 2, 2, 1, 1],
    [1, 1, 1, 2, 2, 1],
    [1, 1, 1, 2, 2, 2],
    [2, 1, 1, 2, 2, 1]
  ];

  it("return indice of the duplicated rows", () => {
    expect(duplicatedRow(duplicated)).toEqual([0, 1]);
  });

  it("return null if there is no match", () => {
    expect(duplicatedRow(noDuplicated)).toBe(null);
  });
});

xdescribe("duplicatedCols", () => {
  const duplicated = [
    [1, 1, 1, 2, 2, 1],
    [1, 1, 1, 2, 2, 2],
    [1, 1, 2, 2, 1, 1],
    [1, 1, 1, 2, 2, 2]
  ];
  const noDuplicated = [
    [1, 1, 2, 2, 1, 1],
    [1, 1, 1, 2, 2, 1],
    [1, 1, 1, 2, 2, 2],
    [2, 1, 1, 2, 2, 1]
  ];

  it("return indice of the duplicated rows", () => {
    expect(duplicatedCols(duplicated)).toEqual([0, 1]);
  });

  it("return null if there is no match", () => {
    expect(duplicatedCols(noDuplicated)).toBe(null);
  });
});

const board = [
  [0, 0, 0, 2, 2, 1],
  [2, 1, 2, 1, 2, 2],
  [2, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 1, 2],
  [2, 0, 1, 1, 0, 2],
  [1, 0, 1, 2, 1, 2]
];

xdescribe("valueAllowed", () => {
  it("return true if the filled value is less than 50% of the row or column", () => {
    expect(valueAllowed(board[2], 2)).toBe(true);
  });
  it("return false if the filled value is more than 50% of the row or column", () => {
    expect(valueAllowed(columns(board)[2], 1)).toBe(false);
  });
});

xdescribe("isPossibleMove", () => {
  it("return true if move is allow", () => {
    expect(isPossibleMove(board, 0, 1, 1)).toBe(true);
  });
  it("return false if move is not possible", () => {
    expect(isPossibleMove(board, 1, 4, 1)).toBe(false);
  });
});

xdescribe("numSquaresFilled", () => {
  it("return number of values filled", () => {
    expect(numSquaresFilled(board, false)).toEqual(30);
  });
  it("return number of values filled that is correct", () => {
    expect(numSquaresFilled(board, true)).toEqual(24);
  });
});

xdescribe("percentageFilled", () => {
  it("return the percentage of correctly filled squares on the board", () => {
    expect(percentageFilled(board)).toBe((2 / 3).toFixed(2)*100);
  });
});

describe("fillBoard",()=>{
  it("return two array, board with 25% squares filled and locked with length of 27",()=>{
    let target = fillBoard(6,false)
    expect(percentageFilled(target.board,false)).toBe(25)
    expect(target.locked.length).toBe(9)
  })
})
