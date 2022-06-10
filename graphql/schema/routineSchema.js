const RoutineTypes = `
  input inputEx{
    _id: ID!,
    exId: ID!,
  }

  input Ex {
    _id: ID,
    exId: ID,
    superset: [inputEx]
  }

  type Superset {
    _id: ID!,
    exId: Exercise!
  }

  type ExList {
    _id: ID!,
    exId: Exercise,
    superset: [Superset]
  }

  input RoutineInput {
    name: String!
    exercises: [Ex]
    color: String!
    _id: ID
  }

  type Routine {
    _id: ID!
    name: String!
    exercises: [ExList!]!
    color: String!
    user: User!
  }
`;

const RoutineQuery = `
  getRoutines:[Routine!]
`;

const RoutineMutation = `
  createRoutine(routineInput: RoutineInput): Routine
  deleteRoutine(routineId: String!): String!
`;

module.exports = {
  RoutineTypes,
  RoutineQuery,
  RoutineMutation
}