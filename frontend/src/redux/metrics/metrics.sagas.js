import { takeLatest, put, all, call } from 'redux-saga/effects';
import MetricsActionTypes from './metrics.types';

import {
  getMetricsSuccess,
  getMetricsFailure,
} from './metrics.actions';

import {
  metricsService
} from '../../services/metrics.service';


export function* getMetrics({ payload }) {
  try {
    const metrics = yield metricsService.getMetrics(payload.date);
    yield put(getMetricsSuccess({data: metrics.data.getMetrics,selectedDateIndex:payload.selectedDateIndex}));
  } catch (error) {
    yield put(getMetricsFailure(error));
  }
}

export function* onGetMetricsStart() {
  yield takeLatest(MetricsActionTypes.GET_METRICS_START, getMetrics);
}

export function* metricsSagas() {
  yield all([
    call(onGetMetricsStart)
  ]);
}