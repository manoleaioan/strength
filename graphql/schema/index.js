const { buildSchema } = require('graphql');
const { UserTypes, UserQuery, UserMutation } = require('./userSchema');
const { ExerciseTypes, ExerciseQuery, ExerciseMutation } = require('./exerciseSchema');
const { RoutineTypes, RoutineQuery, RoutineMutation } = require('./routineSchema');
const { WorkoutTypes, WorkoutQuery, WorkoutMutation } = require('./workoutSchema');
const { MetricsTypes, MetricsQuery, MetricsMutation } = require('./metricsSchema');

module.exports = buildSchema(`
  ${UserTypes}
  ${ExerciseTypes}
  ${RoutineTypes}
  ${WorkoutTypes}
  ${MetricsTypes}

  type RootQuery {
    ${UserQuery}
    ${ExerciseQuery}
    ${RoutineQuery}
    ${WorkoutQuery}
    ${MetricsQuery}
  }

  type RootMutation {
    ${UserMutation}
    ${ExerciseMutation}
    ${RoutineMutation}
    ${WorkoutMutation}
    ${MetricsMutation}
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)