import { makeExecutableSchema } from "graphql-tools";
import gql from "graphql-tag";
import game from "../../lib/game";
import { PubSub } from "apollo-server";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { importSchema } from "graphql-import";
const typeDefs = importSchema("./src/schema/schema.graphql");

let newGame;
const pubsub = new PubSub();
const resolvers = {
  Query: {
    board() {
      if (newGame) {
        return newGame;
      }
      throw new Error("Game not initialized");
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
    }
  },
  Mutation: {
    boardInit(parent, args, ctx, info) {
      try {
        newGame = game.fillBoard(args.size);
        pubsub.publish("boardUpdated", {
          boardUpdated: {
            board: newGame,
            dupeCol: null,
            dupeRow: null,
            culpritsCoords: null
          }
        });
        return true;
      } catch (err) {
        throw new Error("Initialize fail");
      }
    },
    async clickOnTile(root, { x, y }, ctx) {
      if (newGame) {
        const currentValue = newGame.colsAndRows[y][x];
        let newNum = currentValue === 1 ? 2 : 1;
        newGame.colsAndRows[y][x] = newNum;
        const dupeRow = game.duplicatedRow(newGame.colsAndRows);
        const dupeCol = game.duplicatedCols(newGame.colsAndRows);
        const culpritsCoords = await game.culprits(newGame.colsAndRows);
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
  context: async ({ req, connection }) => {
    if (connection) return connection.context;
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
