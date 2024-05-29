import { takeLatest, put, all, call } from 'redux-saga/effects';
import ExerciseActionTypes from './exercise.types';

import {
  getExercisesSuccess,
  getExercisesFailure,
  createExerciseSuccess,
  createExerciseFailure,
  deleteExerciseSuccess,
  deleteExerciseFailure,
  getExerciseChardDataFailure,
  getExerciseChardDataSuccess
} from './exercise.actions';

import {
  exercisesService
} from '../../services/exercises.service';


export function* getExercises() {
  try {
    const exercises = yield exercisesService.getExercises();
    yield put(getExercisesSuccess(exercises.data.getExercises));
  } catch (error) {
    yield put(getExercisesFailure(error));
  }
}

export function* getExercise({ payload }) {
  try {
    const exercises = yield exercisesService.getExercises(payload);
    yield put(getExercisesSuccess(exercises.data.getExercise));
  } catch (error) {
    yield put(getExercisesFailure(error));
  }
}

export function* createExercise({ payload: { exerciseInput } }) {
  try {
    const exercise = yield exercisesService.createExercise(exerciseInput);
    yield put(createExerciseSuccess(exercise.data.createExercise));
  } catch (error) {
    yield put(createExerciseFailure(error));
  }
}

export function* deleteExercise({ payload: { exerciseId } }) {
  try {
    const exercise = yield exercisesService.deleteExercise(exerciseId);
    yield put(deleteExerciseSuccess(exercise.data.deleteExercise));
  } catch (error) {
    yield put(deleteExerciseFailure(error));
  }
}

export function* getExerciseChartData({ payload: { exerciseId, period } }) {
  try {
    const exercise = yield exercisesService.getExerciseChartData({ exerciseId, period });
    yield put(getExerciseChardDataSuccess({ ...exercise.data.getExerciseChartData, exerciseId }));
  } catch (error) {
    yield put(getExerciseChardDataFailure(error));
  }
}

export function* onGetExercisesStart() {
  yield takeLatest(ExerciseActionTypes.GET_EXERCISES_START, getExercises);
}

export function* onCreateExercisesStart() {
  yield takeLatest(ExerciseActionTypes.CREATE_EXERCISE_START, createExercise);
}

export function* onDeleteExerciseStart() {
  yield takeLatest(ExerciseActionTypes.DELETE_EXERCISE_START, deleteExercise);
}

export function* onGetExerciseChartDataStart() {
  yield takeLatest(ExerciseActionTypes.GET_EXERCISE_CHART_START, getExerciseChartData);
}

export function* onGetExerciseStart() {
  yield takeLatest(ExerciseActionTypes.GET_EXERCISE_START, getExercise);
}

export function* exerciseSagas() {
  yield all([
    call(onGetExercisesStart),
    call(onCreateExercisesStart),
    call(onDeleteExerciseStart),
    call(onGetExerciseChartDataStart),
    call(onGetExerciseStart),
  ]);
}