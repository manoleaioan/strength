import { createSelector } from 'reselect';

const selectRoutines = state => state.routines;

export const selectRoutineList = createSelector(
  [selectRoutines],
  routines => routines
);

export const selectError = createSelector(
  [selectRoutines],
  routines => routines.error
);