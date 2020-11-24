const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./modules/events");

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event{
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery{
      events: [Event!]!
    }

    type RootMutation{
      createEvent(eventInput: EventInput): Event
    }

    schema{
      query: RootQuery
      mutation: RootMutation
    }`),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => events.map((event) => ({ ...event._doc })))
          .catch((err) => {
            throw err;
          });
      },
      createEvent: ({ eventInput: { title, description, price, date } }) => {
        const event = new Event({
          title: title,
          description: description,
          price: price,
          date: new Date(date),
        });
        return event
          .save()
          .then((result) => ({ ...result._doc }))
          .catch((err) => {
            throw err;
          });
      },
    },
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
