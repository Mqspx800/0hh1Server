import { makeExecutableSchema } from "graphql-tools";
import gql from "graphql-tag";
import game from "../../lib/game";

const typeDefs = gql`
  type Query {
    boardInit(size: Int!): Board!
  }

  type Board {
    board: [[Int!]]!
    locked: [Coords]
  }

  type Coords {
    x: Int
    y: Int
  }

  type Mutation {
    clickOnTile(x: Int!, y: Int!): Board
  }
`;
let newGame;
const resolvers = {
  Query: {
    async boardInit(parent, args, ctx, info) {
      newGame = await game.fillBoard(args.size);
      return newGame;
    }
  },
  Mutation: () => {
    clickOnTile(x, y);
    return newGame;
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
