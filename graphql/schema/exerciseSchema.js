const ExerciseTypes = `
  input ExerciseInput {
    name: String!
    type: Int
    _id: ID
  }

  type Exercise {
    _id: ID!
    name: String!
    type: Int!
    maxRep: String!
    maxVol: String!
    activityAt: String
    user: User!
  }
`;

const ExerciseQuery = `
  getExercises:[Exercise!]
`;

const ExerciseMutation = `
  createExercise(exerciseInput: ExerciseInput): Exercise
  deleteExercise(exerciseId: String!): String!
`;

module.exports = {
  ExerciseTypes,
  ExerciseQuery,
  ExerciseMutation
}