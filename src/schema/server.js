import { PubSub, withFilter } from "apollo-server";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { importSchema } from "graphql-import";
import { getUniqueID } from "../../lib/auth";
import { getRoomWithSessionID } from "../../lib/roomManage";
const Query = require("./Query");
const Mutation = require("./Mutation");

const typeDefs = importSchema("./src/schema/schema.graphql");
export const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription: {
    opponentBoardUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("opponentBoardUpdated"),
        (payload, variables) => {
          const room = getRoomWithSessionID(getUniqueID(variables.sessionID));
          return (
            room &&
            variables.sessionID != payload.opponentBoardUpdated.sessionID
          );
        }
      )
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
