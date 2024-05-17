const express = require('express');
const cookieParser = require("cookie-parser");
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');
const cors = require('cors');
const app = express();
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
const path = require('path');

app.use(graphqlUploadExpress());
app.set("view engine", "ejs");
app.use(isAuth);
app.use(cookieParser());
app.use(cors());


app.use('/graphql', graphqlHTTP((req, res, graphQLParams) => {
  return {
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: process.env.NODE_ENV === 'development',
    context: { req, res }
  }
}));

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', function (req, res) {
  res.sendFile(
    path.join(__dirname, 'frontend/build', 'index.html'),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.uugt1.mongodb.net/${process.env.MONGO_STRENGTH_COLLECTION}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true
}).then(() => {
  app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
}).catch(err => {
  console.log(err);
});