import koa from "koa";
import koarouter from "koa-router";
import bodyParser from "koa-bodyparser";
import { graphqlKoa, graphiqlKoa } from "apollo-server-koa";
import schema from "./schema/schema";

const app = new koa();
const router = new koarouter();
const port = process.env.PORT || 4000;


router.post('/graphql', bodyParser(), graphqlKoa({ schema }));
router.get('/graphql', graphqlKoa({ schema }));

router.get(
  "/graphiql",
  graphiqlKoa({
    endpointURL: "/graphql"
  })
);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(
    `access server enpoint is at ${url}/graphql\n, graphiql playground is at address ${url}/graphiql`
  );
});
