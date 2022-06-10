import { createSelector } from 'reselect';

const selectExercises = state => state.exercises;

export const selectExerciseList = createSelector(
  [selectExercises],
  exercises => exercises
);

export const selectError = createSelector(
  [selectExercises],
  exercises => exercises.error
);