import { takeLatest, put, all, call, select } from 'redux-saga/effects';
import WorkoutActionTypes from './workout.types';

import {
  getWorkoutsSuccess,
  getWorkoutsFailure,
  createWorkoutSuccess,
  createWorkoutFailure,
  deleteWorkoutSuccess,
  deleteWorkoutFailure,
  getWorkoutDaysSuccess,
  getWorkoutDaysFailure,
} from './workout.actions';

import { updateWorkout } from '../routine/routine.actions';

import {
  workoutsService
} from '../../services/workouts.service';
import { selectMetrics } from '../metrics/metrics.selectors';
import { getMetricsStart } from '../metrics/metrics.actions';
import { getExerciseStart } from '../exercise/exercise.actions';

function* updateMetrics(){
  const metrics = yield select(selectMetrics);
  if (metrics.date) {
    yield put(getMetricsStart({ date: metrics.date, selectedDateIndex: metrics.selectedDateIndex }));
  }
}

export function* getWorkouts({ payload }) {
  try {
    const workouts = yield workoutsService.getWorkouts(payload);
    console.log(payload)
    yield put(getWorkoutsSuccess({ workouts: workouts.data.getWorkouts, selectedDate: payload }));
  } catch (error) {
    yield put(getWorkoutsFailure(error));
  }
}

export function* createWorkout({ payload: { workoutInput, exId }, callback }) {
  try {
    const workout = yield workoutsService.createWorkout(workoutInput);
    yield put(createWorkoutSuccess(workout.data.createWorkout));
    if (callback) callback(workout.data.createWorkout);
    yield updateMetrics();
    if(exId){
      yield put(getExerciseStart(exId));
    }else{
      yield put(updateWorkout(workout.data.createWorkout));
    }
  } catch (error) {
    yield put(createWorkoutFailure(error));
    if (callback) callback({ error })
  }
}

export function* deleteWorkout({ payload: { workoutId, routineId } }) {
  try {
    const workout = yield workoutsService.deleteWorkout(workoutId);
    yield put(deleteWorkoutSuccess(workout.data.deleteWorkout));
    yield put(updateWorkout({ routineId, deleted: true }));
    yield updateMetrics();
  } catch (error) {
    yield put(deleteWorkoutFailure(error));
    console.log(error)
  }
}

export function* getWorkoutDays({ payload: { year, utcOffset } }) {
  try {
    const workoutDays = yield workoutsService.getWorkoutDays(year, utcOffset);
    yield put(getWorkoutDaysSuccess({
      year: year,
      days: workoutDays.data.getWorkoutDays
    }));
  } catch (error) {
    yield put(getWorkoutsFailure(error));
  }
}

export function* onGetWorkoutDaysStart() {
  yield takeLatest(WorkoutActionTypes.GET_WORKOUT_DAYS_START, getWorkoutDays);
}
export function* onGetWorkoutsStart() {
  yield takeLatest(WorkoutActionTypes.GET_WORKOUTS_START, getWorkouts);
}

export function* onCreateWorkoutsStart() {
  yield takeLatest(WorkoutActionTypes.CREATE_WORKOUT_START, createWorkout);
}

export function* onDeleteWorkoutStart() {
  yield takeLatest(WorkoutActionTypes.DELETE_WORKOUT_START, deleteWorkout);
}

export function* workoutSagas() {
  yield all([
    call(onGetWorkoutsStart),
    call(onCreateWorkoutsStart),
    call(onDeleteWorkoutStart),
    call(onGetWorkoutDaysStart)
  ]);
}