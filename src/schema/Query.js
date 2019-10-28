import {getToken} from "../../lib/auth"

export function board(_, __, { sessionID }) {
  return getBoardBySessionID(roomList, sessionID);
}

export function dupeCol(_, __, { sessionID }) {
  board = getBoardBySessionID(sessionID);
  if (board) return game.duplicatedCols(board.colsAndRows);
  return null;
}

export function dupeRow(_, __, { sessionID }) {
  board = getBoardBySessionID(sessionID);
  if (board) return game.duplicatedRow(board.colsAndRows);
  return null;
}

export function culpritsCoords(_, __, { sessionID }) {
  board = getBoardBySessionID(sessionID);
  if (board) return game.culprits(board.colsAndRows);
  return null;
}

export function getTokenString() {
  return getToken();
}
