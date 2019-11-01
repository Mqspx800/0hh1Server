import { getToken } from "../../lib/auth";
import { getRoomWithSessionID } from "../../lib/roomManage";
import game from "../../lib/game";

export function board(_, __, { sessionID }) {
  const room = getRoomWithSessionID(sessionID);
  const data = room.boards.map(board => {
    const dupeCol = game.duplicatedCols(board.colsAndRows);
    const dupeRow = game.duplicatedRow(board.colsAndRows);
    const culpritsCoords = game.culprits(board.colsAndRows);
    return { sessionID, board, dupeCol, dupeRow, culpritsCoords };
  });
  return data;
}

export function getTokenString() {
  return getToken();
}
