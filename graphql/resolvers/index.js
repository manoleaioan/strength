const authResolver = require('./auth');
const exerciseResolver = require('./exercise');
const routineResolver = require('./routine');


const rootResolver = {
  ...authResolver,
  ...exerciseResolver,
  ...routineResolver
}

module.exports = rootResolver