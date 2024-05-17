const authResolver = require('./auth');
const exerciseResolver = require('./exercise');
const routineResolver = require('./routine');
const workoutResolver = require('./workout');
const metricsResolver = require('./metrics');


const rootResolver = {
  ...authResolver,
  ...exerciseResolver,
  ...routineResolver,
  ...workoutResolver,
  ...metricsResolver
}

module.exports = rootResolver