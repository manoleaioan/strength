import { createSelector } from 'reselect';

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  user => user
);

export const selectError = createSelector(
  [selectUser],
  user => user.error
);

export const selectVerification_res = createSelector(
  [selectUser],
  user => user.verification_res
);

export const selectPwReset_res = createSelector(
  [selectUser],
  user => user.pwReset_res
);