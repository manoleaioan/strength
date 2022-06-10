import { all, call } from 'redux-saga/effects';

import { userSagas } from './user/user.sagas';
import { exerciseSagas } from './exercise/exercise.sagas';
import { routineSagas } from './routine/routine.sagas';

export default function* rootSaga() {
  yield all(
    [
      call(userSagas),
      call(exerciseSagas),
      call(routineSagas)
    ]
  );
}