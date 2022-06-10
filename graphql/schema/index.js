const { buildSchema } = require('graphql');
const { UserTypes, UserQuery, UserMutation } = require('./userSchema');
const { ExerciseTypes, ExerciseQuery, ExerciseMutation } = require('./exerciseSchema');
const { RoutineTypes, RoutineQuery, RoutineMutation } = require('./routineSchema');

module.exports = buildSchema(`
  ${UserTypes}
  ${ExerciseTypes}
  ${RoutineTypes}

  type RootQuery {
    ${UserQuery}
    ${ExerciseQuery}
    ${RoutineQuery}
  }

  type RootMutation {
    ${UserMutation}
    ${ExerciseMutation}
    ${RoutineMutation}
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)