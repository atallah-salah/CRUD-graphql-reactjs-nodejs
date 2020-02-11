// import packages
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require('mongoose')
// init app
const app = express();

// Middleware
app.use(bodyParser.json());

const events = [];

app.use(
  '/api',
  graphqlHttp({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        input EventInput {
          title: String!
          description: String!
          price: Int!
          date: String!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        }
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

// Routes


mongoose.connect(`mongodb+srv://user1:<password>@cluster0-ha2pv.mongodb.net/test?retryWrites=true&w=majority`)

app.listen(2000);
