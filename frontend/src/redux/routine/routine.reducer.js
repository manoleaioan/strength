import RoutineActionTypes from './routine.types';
import ExerciseActionTypes from '../exercise/exercise.types';

const INITIAL_STATE = {
  routineList: null,
  isLoading: true,
  error: null,
  deleteRoutine_res: null
};

function upsert(array, element) {
  const index = array.findIndex(e => e._id === element._id);
  return index > -1 
    ? array.map((e, i) => i === index ? { ...e, ...element } : e) 
    : [...array, element];
}

const routineReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RoutineActionTypes.GET_ROUTINES_START:
      return {
        ...state,
        isLoading: true
      };
    case RoutineActionTypes.GET_ROUTINES_SUCCESS:
      return {
        ...state,
        routineList: action.payload,
        error: null,
        isLoading: false
      };
    case RoutineActionTypes.CREATE_ROUTINE_SUCCESS:
      return {
        ...state,
        routineList: upsert(state.routineList, action.payload),
        error: null,
        isLoading: false
      };
    case RoutineActionTypes.DELETE_ROUTINE_SUCCESS:
      return {
        ...state,
        routineList: state.routineList.filter(e => e._id !== action.payload),
        deleteRoutine_res: action.payload,
      };
    case RoutineActionTypes.DELETE_ROUTINE_FAILURE:
      return {
        ...state,
        deleteRoutine_res: action.payload,
      };
    case RoutineActionTypes.GET_ROUTINES_FAILURE:
    case RoutineActionTypes.CREATE_ROUTINE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case ExerciseActionTypes.DELETE_EXERCISE_SUCCESS:
      return {
        ...state,
        routineList: state.routineList?.map(r => {
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
        routineList: state.routineList?.map(r => {
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
      case RoutineActionTypes.UPDATE_LAST_WORKOUT_DATE:
        const { routineId, startDate } = action.payload;
        return {
          ...state,
          routineList: state.routineList?.map(routine =>
            routine._id === routineId ? { ...routine, lastWorkoutDate: startDate } : routine
          )
        };
    default:
      return state;
  }
};

export default routineReducer;