// import packages
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require('mongoose')
// init app
const app = express();


// Models 
const Event = require('./models/event') ;


// Middleware
app.use(bodyParser.json());


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
          price: Float!
          date: String!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
        .then(events=>{
          return events.map(event =>{
            return {...event._doc,_id:event.id}
          })
        })
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event.save()
        .then((result)=>{
          console.log(result)
          return {...result._doc,_id:result._doc._id.toString()};
        })
        .catch(err=>{
          console.log(err);
          throw err;
        })
      }
    },
    graphiql: true
  })
);

// Routes

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ha2pv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  })
.then(()=>{  
  app.listen(2000);
})
.catch(err=>{
  console.log(err);
})

