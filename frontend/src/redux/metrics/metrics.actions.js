import MetricsActionTypes from './metrics.types';

export const getMetricsStart = date => ({
  type: MetricsActionTypes.GET_METRICS_START,
  payload: date
});

export const getMetricsSuccess = metrics => ({
  type: MetricsActionTypes.GET_METRICS_SUCCESS,
  payload: metrics
});

export const getMetricsFailure = error => ({
  type: MetricsActionTypes.GET_METRICS_FAILURE,
  payload: error
});