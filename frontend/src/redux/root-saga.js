import { all, call } from 'redux-saga/effects';

import { userSagas } from './user/user.sagas';
import { exerciseSagas } from './exercise/exercise.sagas';
import { routineSagas } from './routine/routine.sagas';
import { workoutSagas } from './workout/workout.sagas';
import { metricsSagas } from './metrics/metrics.sagas';

export default function* rootSaga() {
  yield all(
    [
      call(userSagas),
      call(exerciseSagas),
      call(routineSagas),
      call(workoutSagas),
      call(metricsSagas)
    ]
  );
}