const express = require('express');
const cookieParser = require("cookie-parser");
const { createHandler } = require('graphql-http/lib/use/express');
const mongoose = require("mongoose");
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
const isAuth = require('./middleware/is-auth');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(graphqlUploadExpress());
app.set("view engine", "ejs");
app.use(isAuth);
app.use(cookieParser());
app.use(cors());


app.use('/graphql', (req, res, next) => {
  if (req.is('multipart/form-data')) {
    graphQlResolvers.changeProfilePicture(req.body.variables, { req: req })
      .then(result => {
        res.json({ data: { changeProfilePicture: result } });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  } else {
    next();
  }
});


app.all('/graphql', createHandler({
  schema:graphQlSchema,
  rootValue:graphQlResolvers,
  graphiql: process.env.NODE_ENV === 'development',
  validationRules:[],
  context: (p) => {
    return {
      req: p.raw,
      res: p.context.res
    };
  },
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