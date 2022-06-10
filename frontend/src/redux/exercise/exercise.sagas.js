import { takeLatest, put, all, call } from 'redux-saga/effects';
import ExerciseActionTypes from './exercise.types';

import {
  getExercisesSuccess,
  getExercisesFailure,
  createExerciseSuccess,
  createExerciseFailure,
  deleteExerciseSuccess,
  deleteExerciseFailure
} from './exercise.actions';

import {
  userService
} from '../../services/user.service';


export function* getExercises() {
  try {
    const exercises = yield userService.getExercises();
    yield put(getExercisesSuccess(exercises.data.getExercises));
  } catch (error) {
    yield put(getExercisesFailure(error));
  }
}

export function* createExercise({ payload: { exerciseInput } }) {
  try {
    const exercise = yield userService.createExercise(exerciseInput);
    yield put(createExerciseSuccess(exercise.data.createExercise));
  } catch (error) {
    yield put(createExerciseFailure(error));
  }
}

export function* deleteExercise({ payload: { exerciseId } }) {
  try {
    const exercise = yield userService.deleteExercise(exerciseId);
    yield put(deleteExerciseSuccess(exercise.data.deleteExercise));
  } catch (error) {
    yield put(deleteExerciseFailure(error));
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

export function* exerciseSagas() {
  yield all([
    call(onGetExercisesStart),
    call(onCreateExercisesStart),
    call(onDeleteExerciseStart)
  ]);
}