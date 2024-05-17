const WorkoutTypes = `
  type ExerciseDetail {
    _id: ID,
    name: String,
    type: Int,
  }
  
  input inputRecord {
    record: Int!
    weight: Int!
  }

  type Record {
    record: Int!
    weight: Int!
  }

  input inputExerciseDetail {
    _id: ID,
    name: String,
    type: Int
  }
  
  input inputExWithRecords {
    _id: ID!,
    exId: inputExerciseDetail!,
    records: [inputRecord],
    prevRecords: [inputRecord]
  }

  input ExWithRecords {
    _id: ID,
    exId: inputExerciseDetail,
    superset: [inputExWithRecords],
    records: [inputRecord],
    prevRecords: [inputRecord]
  }

  type SupersetWithRecords {
    _id: ID!,
    exId: ExerciseDetail!,
    records: [Record],
    prevRecords: [Record]
  }

  type ExListWithRecords {
    _id: ID!,
    exId: ExerciseDetail,
    superset: [SupersetWithRecords],
    records: [Record],
    prevRecords: [Record]
  }

  input InputExerciseRecordUpdated{
    _id: ID,
    time: String
  }
  
  input WorkoutInput {
    name: String
    exercises: [ExWithRecords]
    color: String
    _id: ID
    startDate: String
    endDate: String
    routineId: ID
    workoutId: ID
    exerciseRecordUpdated: InputExerciseRecordUpdated
  }
  
  type Workout {
    _id: ID!
    name: String!
    exercises: [ExListWithRecords!]!
    color: String!
    user: User!
    startDate:String!
    endDate:String
    routineId: ID
  }

  type WorkoutDay {
    startDate:String
  }
`;

const WorkoutQuery = `
  getWorkouts(date:String):[Workout!]
  getWorkoutDays(year: String!, utcOffset: String):[String!]
`;

const WorkoutMutation = `
  createWorkout(workoutInput: WorkoutInput): Workout
  deleteWorkout(workoutId: String!): String!
`;

module.exports = {
  WorkoutTypes,
  WorkoutQuery,
  WorkoutMutation
}