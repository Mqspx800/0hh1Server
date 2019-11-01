const game = require("./game");

class room {
  constructor(mode) {
    this.players = [];
    this.boards = [];
    this.boardSize = 6;
    this.state = "await";
    this.mode = mode || "single";
  }

  emptyBoard = () => {
    return (this.boards = this.boards.map(b =>
      new Array(n).fill(0).map(r => new Array(this.boardSize).fill(0))
    ));
  };

  allPlayersReady = () => {
    if (this.mode != "single") {
      return this.players.length > 1 && !this.players.some(p => !p.ready);
    }
    return true;
  };

  start = () => {
    if (this.isFull() && this.state === "await" && this.allPlayersReady()) {
      let n = 0;
      this.mode === "single" ? (n = 1) : (n = 2);
      this.boards = new Array(n)
        .fill(0)
        .map(b => (b = game.fillBoard(this.boardSize)));
      this.state = "start";
    } else throw new Error("Not able to start game");
    return this.boards;
  };

  end = () => {
    if (this.state === "start") this.state = "await";
    return this.emptyBoard();
  };

  getBoardBySessionID = sid => {
    const index = this.players.findIndex(p => p.id === sid);
    return this.boards[index];
  };

  setupTimer = (mins, updateFunction) => {
    let sec = mins * 60;
    let x = setInterval(() => {
      sec -= 1;
      if (sec > 0) updateFunction(sec);
      else clearInterval(x);
    }, 1000);
  };

  join = p => {
    if (this.mode === "single" && this.isEmpty()) {
      this.players.push({ id: p });
      return;
    }
    if (!this.isFull()) {
      this.players.push({ id: p });
    } else throw new Error("Room full");
  };

  exit = p => {
    const target = this.players.findIndex(t => t.id === p);
    if (target) this.players.splice(target, 1);
  };

  isFull = () => {
    return this.mode === "single"
      ? this.players.length === 1
      : this.players.length === 2;
  };

  isEmpty = () => {
    return this.players.length === 0;
  };
}

module.exports = room;
