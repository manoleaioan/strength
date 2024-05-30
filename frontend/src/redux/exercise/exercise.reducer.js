import ExerciseActionTypes from './exercise.types';

const INITIAL_STATE = {
  exerciseList: null,
  isLoading: true,
  error: null,
  deleteExercise_res: null,
  exerciseChart: {
    exerciseId: null,
    data: null,
    loading: false,
    error: null
  }
};

function upsert(array, element) {
  const i = array.findIndex(e => e._id === element._id);

  if (i > -1) {
    array[i] = { ...element };
    return [...array];
  }

  return [...array, { ...element }]
}

const exerciseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ExerciseActionTypes.GET_EXERCISES_START:
      return {
        ...state,
        isLoading: true
      };
    case ExerciseActionTypes.GET_EXERCISES_SUCCESS:
      return {
        ...state,
        exerciseList: action.payload,
        error: null,
        isLoading: false
      };
    case ExerciseActionTypes.CREATE_EXERCISE_SUCCESS:
      return {
        ...state,
        exerciseList: upsert(state.exerciseList, action.payload),//[ ...state.exerciseList, ...[action.payload]]
        error: null,
        isLoading: false
      };
    case ExerciseActionTypes.DELETE_EXERCISE_SUCCESS:
      return {
        ...state,
        exerciseList: state.exerciseList.filter(e => e._id !== action.payload),
        deleteExercise_res: action.payload,
      };
    case ExerciseActionTypes.DELETE_EXERCISE_FAILURE:
      return {
        ...state,
        deleteExercise_res: action.payload,
      };
    case ExerciseActionTypes.GET_EXERCISES_FAILURE:
    case ExerciseActionTypes.CREATE_EXERCISE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case ExerciseActionTypes.GET_EXERCISE_CHART_START:
      return {
        ...state,
        exerciseChart: {
          ...state.exerciseChart,
          loading: true,
          error: false
        }
      }
    case ExerciseActionTypes.GET_EXERCISE_CHART_SUCCESS:
      return {
        ...state,
        exerciseChart: {
          ...state.exerciseChart,
          data: action.payload,
          exerciseId: action.payload.exerciseId,
          error: false,
          loading: false
        }
      }
    case ExerciseActionTypes.GET_EXERCISE_CHART_FAILURE:
      return {
        ...state,
        exerciseChart: {
          ...state.exerciseChart,
          loading: false,
          error: action.payload
        }
      }
    case ExerciseActionTypes.GET_EXERCISE_SUCCESS:
      return {
        ...state,
        exerciseList: upsert(state.exerciseList, action.payload),
        exerciseChart: {
          exerciseId: null,
          data: null,
          loading: false,
          error: null
        }
      }
    default:
      return state;
  }
};

export default exerciseReducer;