const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphQLSchema = require("./graphql/schema/");
const graphQLResolvers = require("./graphql/resolvers/");

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/events", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(4000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => console.log(err));
