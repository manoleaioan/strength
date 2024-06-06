import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import exerciseReducer from './exercise/exercise.reducer';
import routineReducer from './routine/routine.reducer';
import workoutReducer from './workout/workout.reducer';
import metricsReducer from './metrics/metrics.reducer';

import UserActionTypes from './user/user.types';

const appReducer = combineReducers({
  user: userReducer,
  exercises: exerciseReducer,
  routines: routineReducer,
  workouts: workoutReducer,
  metrics: metricsReducer
});

const rootReducer = (state, action) => {
  if (action.type === UserActionTypes.SIGN_OUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;