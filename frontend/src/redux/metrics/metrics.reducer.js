import MetricsActionTypes from './metrics.types';

const INITIAL_STATE = {
  data: {
    general: {},
    routines: [],
    exercises: [],
  },
  selectedDateIndex: 7,
  isLoading: true,
  error: null,
};

const metricsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MetricsActionTypes.GET_METRICS_START:
      return {
        ...state,
        isLoading: true
      };
    case MetricsActionTypes.GET_METRICS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        selectedDateIndex:action.payload.selectedDateIndex,
        error: null,
        isLoading: false
      };
    case MetricsActionTypes.GET_METRICS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    default:
      return state;
  }
};

export default metricsReducer;