import {
  createRoom,
  joinOrCreateMultipleGame,
  getRoomWithSessionID,
  getBoardBySessionID
} from "../../lib/roomManage";
import game from "../../lib/game";
import { pubsub } from "./server";

export function joinRoom(_, { mode }, { sessionID }) {
  try {
    const room = getRoomWithSessionID(sessionID);
    if (room) throw new Error("Player already in a room");
    if (mode === "single") {
      createRoom(sessionID, mode);
      return mode;
    } else {
      joinOrCreateMultipleGame(sessionID);
      return "multiple";
    }
  } catch (err) {
    throw new Error(err);
  }
}

export function ready(_, __, { sessionID }) {
  try {
    const room = getRoomWithSessionID(sessionID);
    const player = room.players.find(p => p.id === sessionID);
    player.ready = true;
    if (room.allPlayersReady()) {
      room.start();
      return true
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

export function clickOnTile(root, { x, y }, { sessionID }) {
  let board = getBoardBySessionID(sessionID);
  if (board) {
    const currentValue = board.colsAndRows[y][x];
    let newNum = currentValue === 1 ? 2 : 1;
    board.colsAndRows[y][x] = newNum;
    const dupeRow = game.duplicatedRow(board.colsAndRows);
    const dupeCol = game.duplicatedCols(board.colsAndRows);
    const culpritsCoords = game.culprits(board.colsAndRows);
    pubsub.publish("opponentBoardUpdated", {
      opponentBoardUpdated: {
        sessionID,
        board,
        dupeCol,
        dupeRow,
        culpritsCoords
      }
    });
    return { sessionID, board, dupeCol, dupeRow, culpritsCoords };
  }
  throw new Error("Game is not initialized");
}
