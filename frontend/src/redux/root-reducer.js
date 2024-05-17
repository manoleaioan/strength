import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import exerciseReducer from './exercise/exercise.reducer';
import routineReducer from './routine/routine.reducer';
import workoutReducer from './workout/workout.reducer';
import metricsReducer from './metrics/metrics.reducer';

const rootReducer = combineReducers({
  user: userReducer,
  exercises: exerciseReducer,
  routines: routineReducer,
  workouts: workoutReducer,
  metrics: metricsReducer
});

export default rootReducer;