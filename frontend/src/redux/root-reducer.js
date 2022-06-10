import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import exerciseReducer from './exercise/exercise.reducer';
import routineReducer from './routine/routine.reducer';

const rootReducer = combineReducers({
  user: userReducer,
  exercises: exerciseReducer,
  routines: routineReducer
});

export default rootReducer;