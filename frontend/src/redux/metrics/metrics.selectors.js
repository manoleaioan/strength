import { createSelector } from 'reselect';

const selectMetricsObject = state => state.metrics;

export const selectMetrics = createSelector(
  [selectMetricsObject],
  data => data
);

export const selectError = createSelector(
  [selectMetricsObject],
  metrics => metrics.error
);