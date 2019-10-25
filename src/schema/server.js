import game from "../../lib/game";
import { PubSub } from "apollo-server";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { importSchema } from "graphql-import";
import { getToken, getUniqueID } from "../../lib/auth";
import {
  createRoom,
  joinOrCreateMultipleGame,
  getRoomWithSessionID
} from "../../lib/roomManage";
const typeDefs = importSchema("./src/schema/schema.graphql");
const roomList = [];
const pubsub = new PubSub();

const resolvers = {
  Query: {
    board(_, __, { room }) {
      return room.boards;
    },
    dupeCol(_, __, { board }) {
      if (board) return game.duplicatedCols(board.colsAndRows);
      return null;
    },
    dupeRow(_, __, { board }) {
      if (board) return game.duplicatedRow(board.colsAndRows);
      return null;
    },
    culpritsCoords(_, __, { board }) {
      if (board) return game.culprits(board.colsAndRows);
      return null;
    },
    getTokenString() {
      return getToken();
    }
  },
  Mutation: {
    joinRoom(parent, { mode }, { sessionID }, info) {
      const room = getRoomWithSessionID(roomList, sessionID);
      try {
        if (room) throw new Error("Player already in a room");
        if (mode === "single") {
          createRoom(sessionID, mode, roomList);
          return true;
        } else {
          joinOrCreateMultipleGame( sessionID, roomList);
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
        if (room.allPlayersReady()) room.start();
        return room.boards;
      } catch (error) {
        throw new Error(error);
      }
    },
    clickOnTile(root, { x, y }, { board }) {
      if (board) {
        const currentValue = newGame.colsAndRows[y][x];
        let newNum = currentValue === 1 ? 2 : 1;
        board.colsAndRows[y][x] = newNum;
        const dupeRow = game.duplicatedRow(board.colsAndRows);
        const dupeCol = game.duplicatedCols(board.colsAndRows);
        const culpritsCoords = game.culprits(board.colsAndRows);
        pubsub.publish("boardUpdated", {
          boardUpdated: { board: newGame, dupeCol, dupeRow, culpritsCoords }
        });
        return { board: newGame, dupeCol, dupeRow, culpritsCoords };
      }
      throw new Error("Game is not initialized");
    }
  },
  Subscription: {
    boardUpdated: {
      subscribe: () => pubsub.asyncIterator("boardUpdated")
    }
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
