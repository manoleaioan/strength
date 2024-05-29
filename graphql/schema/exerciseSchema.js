const ExerciseTypes = `
  input ExerciseInput {
    name: String!
    type: Int
    _id: ID,
    maxRep: Int,
    maxVol: Int,
    activityAt: String
  }

  type Exercise {
    _id: ID!
    name: String!
    type: Int!
    maxRep: Int!
    maxVol: Int!
    activityAt: String
    user: User!
  }

  input chartDataInput {
    exerciseId: ID!,
    period: String!
  }

  type ChartDataResult {
    repsData: [RepsData!]!
    volData: [VolData!]!
  }
  
  type RepsData {
    date: String!
    reps: Int!
  }
  
  type VolData {
    date: String!
    vol: Int!
  }
`;

const ExerciseQuery = `
  getExercises(exerciseId: String):[Exercise!]
  getExerciseChartData(chartDataInput: chartDataInput):ChartDataResult
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