import { makeExecutableSchema } from "graphql-tools";
import gql from "graphql-tag";
import game from "../../lib/game";

const typeDefs = gql`
  type Query {
    boardInit(size: Int!): Board!
    board: Board
    dupeRow: [Int!]
    dupeCol: [Int!]
    culpritsCoords: [Coords!]
  }

  type Board {
    colsAndRows: [[Int!]!]
    locked: [Coords]
  }

  type Coords {
    x: Int
    y: Int
  }

  type BoardWithDupeValue {
    board: Board!
    dupeCol: [Int!]
    dupeRow: [Int!]
  }

  type Mutation {
    clickOnTile(x: Int!, y: Int!): BoardWithDupeValue
  }
`;
let newGame;
const resolvers = {
  Query: {
    async boardInit(parent, args, ctx, info) {
      newGame = await game.fillBoard(args.size);

      return newGame;
    },
    board() {
      if (newGame) return newGame;
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
      if (newGame) return game.culprits(newGame);
      throw new Error("Game not initialized");
    }
  },
  Mutation: {
    clickOnTile(root, { x, y }, ctx) {
      if (newGame) {
        const currentValue = newGame.colsAndRows[y][x];
        let newNum = currentValue === 1 ? 2 : 1;
        newGame.colsAndRows[y][x] = newNum;
        const dupeRow = game.duplicatedRow(newGame.colsAndRows);
        const dupeCol = game.duplicatedCols(newGame.colsAndRows);
        return { board: newGame, dupeCol, dupeRow };
      }
      throw new Error("Game is not initialized");
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
