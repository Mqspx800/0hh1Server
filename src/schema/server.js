import game from "../../lib/game";
import { PubSub } from "apollo-server";
import cors from "cors";
import { ApolloServer, withFilter } from "apollo-server-express";
import { importSchema } from "graphql-import";
import { getToken, getUniqueID } from "../../lib/auth";
import {
  createRoom,
  joinOrCreateMultipleGame,
  getRoomWithSessionID,
  getBoardBySessionID
} from "../../lib/roomManage";
const typeDefs = importSchema("./src/schema/schema.graphql");
const roomList = [];
const pubsub = new PubSub();

const resolvers = {
  Query: {
    board(_, __, { sessionID }) {
      return getBoardBySessionID(roomList, sessionID);
    },
    dupeCol(_, __, { sessionID }) {
      board = getBoardBySessionID(sessionID);
      if (board) return game.duplicatedCols(board.colsAndRows);
      return null;
    },
    dupeRow(_, __, { sessionID }) {
      board = getBoardBySessionID(sessionID);
      if (board) return game.duplicatedRow(board.colsAndRows);
      return null;
    },
    culpritsCoords(_, __, { sessionID }) {
      board = getBoardBySessionID(sessionID);
      if (board) return game.culprits(board.colsAndRows);
      return null;
    },
    getTokenString() {
      return getToken();
    }
  },
  Mutation: {
    joinRoom(parent, { mode }, { sessionID }, info) {
      try {
        const room = getRoomWithSessionID(roomList, sessionID);
        if (room) throw new Error("Player already in a room");
        if (mode === "single") {
          createRoom(sessionID, mode, roomList);
          return true;
        } else {
          joinOrCreateMultipleGame(sessionID, roomList);
          return true;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    ready(_, __, { sessionID }) {
      try {
        const room = getRoomWithSessionID(roomList, sessionID);
        const player = room.players.find(p => p.id === sessionID);
        player.ready = true;
        if (room.allPlayersReady()) {
          room.start();
          return room.boards;
        }
        return null;
      } catch (error) {
        throw new Error(error);
      }
    },
    clickOnTile(root, { x, y }, { sessionID }) {
      let board = getBoardBySessionID(roomList, sessionID);
      if (board) {
        const currentValue = board.colsAndRows[y][x];
        let newNum = currentValue === 1 ? 2 : 1;
        board.colsAndRows[y][x] = newNum;
        const dupeRow = game.duplicatedRow(board.colsAndRows);
        const dupeCol = game.duplicatedCols(board.colsAndRows);
        const culpritsCoords = game.culprits(board.colsAndRows);
        pubsub.publish("boardUpdated", {
          boardUpdated: { sessionID, board, dupeCol, dupeRow, culpritsCoords }
        });
        return { sessionID, board, dupeCol, dupeRow, culpritsCoords };
      }
      throw new Error("Game is not initialized");
    }
  },
  Subscription: {
    boardUpdated: withFilter(
      () => pubsub.asyncIterator("boardUpdated"),
      (payload, variables) => {
        const room = getRoomWithSessionID(variables.sessionID);
        return (
          room &&
          room.players.some(s => s.id === variables.sessionID) &&
          variables.sessionID != payload.boardUpdated.sessionID
        );
      }
    )
  }
};

const schema = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => {
    try {
      if (connection) {
        return connection.context;
      } else {
        const token = req.headers.authorization || "";
        const sessionID = getUniqueID(token) || "";
        return { sessionID };
      }
    } catch (err) {
      console.error(err);
    }
  },
  playground: {
    endpoint: "http://localhost:4000/graphql",
    settings: {
      "editor.theme": "dark"
    }
  },
  cors: cors()
});

export default schema;
