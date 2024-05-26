import WorkoutActionTypes from './workout.types';
import ExerciseActionTypes from '../exercise/exercise.types';

const INITIAL_STATE = {
  workoutList: null,
  selectedDate:null,
  workoutDays: {
    year: null,
    days: null
  },
  isLoading: true,
  error: null,
  deleteWorkout_res: null
};

function upsert(array, element) {
  const i = array.findIndex(e => e._id === element._id);

  if (i > -1) {
    array[i] = { ...element };
    return [...array];
  }

  return [...array, { ...element }]
}

const routineReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WorkoutActionTypes.GET_WORKOUTS_START:
      return {
        ...state,
        isLoading: true,
        workoutList: null
      };
    case WorkoutActionTypes.GET_WORKOUTS_SUCCESS:
      return {
        ...state,
        workoutList: action.payload.workouts,
        error: null,
        isLoading: false,
        selectedDate: action.payload.selectedDate
      };
    case WorkoutActionTypes.CREATE_WORKOUT_SUCCESS:
      return {
        ...state,
        workoutList: upsert(state.workoutList, action.payload),
        workoutDays: {
          year: state.workoutDays.year,
          days: [...state.workoutDays.days, action.payload.startDate]
        },
        error: null,
        isLoading: false
      };
    case WorkoutActionTypes.DELETE_WORKOUT_SUCCESS:
      return {
        ...state,
        workoutList: state.workoutList.filter(e => e._id !== action.payload),
        deleteWorkout_res: action.payload,
      };
    case WorkoutActionTypes.DELETE_WORKOUT_FAILURE:
      return {
        ...state,
        deleteWorkout_res: action.payload,
      };
    case WorkoutActionTypes.GET_WORKOUTS_FAILURE:
    case WorkoutActionTypes.CREATE_WORKOUT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case ExerciseActionTypes.DELETE_EXERCISE_SUCCESS:
      return {
        ...state,
        workoutList: state.workoutList?.map(r => {
          return {
            ...r,
            exercises: r.exercises.filter(e => {
              if (e.superset) {
                e.superset = e.superset.filter(_e => _e.exId?._id !== action.payload);
              }
              return (e.exId?._id === action.payload || e.superset?.length === 0) ? false : e;
            })
          };
        })
      }
    case ExerciseActionTypes.CREATE_EXERCISE_SUCCESS:
      return {
        ...state,
        workoutList: state.workoutList?.map(r => {
          return {
            ...r,
            exercises: r.exercises.map(e => {
              if (e.superset) {
                e.superset = e.superset.map(e => {
                  if (e.exId._id === action.payload._id) {
                    e.exId = action.payload
                  }
                  return e;
                });
              } else if (e.exId._id === action.payload._id) {
                e.exId = action.payload
              }
              return e;
            })
          };
        })
      }
    case WorkoutActionTypes.GET_WORKOUT_DAYS_SUCCESS:
      return {
        ...state,
        workoutDays: action.payload
      }
    default:
      return state;
  }
};

export default routineReducer;