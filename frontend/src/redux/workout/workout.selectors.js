import { createSelector } from 'reselect';

const selectWorkouts = state => state.workouts;

export const selectWorkoutList = createSelector(
  [selectWorkouts],
  workouts => workouts
);

export const selectError = createSelector(
  [selectWorkouts],
  workouts => workouts.error
);