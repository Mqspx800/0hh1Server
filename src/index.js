import express from "express";
import schema from "./schema/server";
import { createServer } from "http";

const port = process.env.PORT || 4000;

const app = express();

schema.applyMiddleware({ app });
const httpserver = createServer(app);
schema.installSubscriptionHandlers(httpserver);

httpserver.listen({ port }, () =>
  console.log(`server listening on port ${port}`)
);
