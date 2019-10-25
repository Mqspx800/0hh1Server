import game from "../../lib/game";
import { PubSub } from "apollo-server";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { importSchema } from "graphql-import";
import { getToken, getUniqueID } from "../../lib/auth";
import roomManager from "../../lib/roomManage";
const typeDefs = importSchema("./src/schema/schema.graphql");

const roomList = [];
const pubsub = new PubSub();

const resolvers = {
  Query: {
    board(_, __, {room}) {
      return room.boards
    },
    dupeCol() {
      if (newGame) return game.duplicatedCols(newGame.colsAndRows);
      return null;
    },
    dupeRow() {
      if (newGame) return game.duplicatedRow(newGame.colsAndRows);
      return null;
    },
    culpritsCoords() {
      if (newGame) return game.culprits(newGame.colsAndRows);
      return null;
    },
    getTokenString() {
      return getToken();
    }
  },
  Mutation: {
    joinRoom(parent, { mode }, { sessionID, room }, info) {
      try {
        if (room) throw new Error("Player already in a room");
        if (mode === "single")
          roomManager.createRoom(sessionID, mode, roomList);
        else
          roomManager.joinOrCreateMultipleGame(
            { sessionID, ready: false },
            roomList
          );
      } catch (err) {
        throw new Error(err);
      }
    },
    ready(_, __, { sessionID, room }) {
      try {
        const p = room.players.find(p => p === sessionID);
        p.ready == true;
      } catch (error) {
        throw new Error(error);
      }
    },
    clickOnTile(root, { x, y }, ctx) {
      if (newGame) {
        const currentValue = newGame.colsAndRows[y][x];
        let newNum = currentValue === 1 ? 2 : 1;
        newGame.colsAndRows[y][x] = newNum;
        const dupeRow = game.duplicatedRow(newGame.colsAndRows);
        const dupeCol = game.duplicatedCols(newGame.colsAndRows);
        const culpritsCoords = game.culprits(newGame.colsAndRows);
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
        room = roomManager.getRoomWithSessionID(rooomList,sessionID) || null;
        return { sessionID, room };
      }
    } catch (err) {
      console.error(err);
    }
  },
  playground: {
    endpoint: "http://localhost:4000/graphql",
    settings: {
      "editor.theme": "light"
    }
  },
  cors: cors()
});

export default schema;
