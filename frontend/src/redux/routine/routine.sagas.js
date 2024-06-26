import { takeLatest, put, all, call } from 'redux-saga/effects';
import RoutineActionTypes from './routine.types';

import {
  getRoutinesSuccess,
  getRoutinesFailure,
  getRoutineSuccess,
  getRoutineFailure,
  createRoutineSuccess,
  createRoutineFailure,
  deleteRoutineSuccess,
  deleteRoutineFailure
} from './routine.actions';

import {
  routinesService
} from '../../services/routines.service';


export function* getRoutine({ payload }) {
  try {
    const routines = yield routinesService.getRoutines(payload);
    yield put(getRoutineSuccess(routines.data.getRoutines[0]));
  } catch (error) {
    yield put(getRoutineFailure(error));
  }
}

export function* getRoutines() {
  try {
    const routines = yield routinesService.getRoutines();
    yield put(getRoutinesSuccess(routines.data.getRoutines));
  } catch (error) {
    yield put(getRoutinesFailure(error));
  }
}

export function* createRoutine({ payload: { routineInput } }) {
  try {
    const routine = yield routinesService.createRoutine(routineInput);
    yield put(createRoutineSuccess(routine.data.createRoutine));
  } catch (error) {
    yield put(createRoutineFailure(error));
  }
}

export function* deleteRoutine({ payload: { routineId } }) {
  try {
    const routine = yield routinesService.deleteRoutine(routineId);
    yield put(deleteRoutineSuccess(routine.data.deleteRoutine));
  } catch (error) {
    yield put(deleteRoutineFailure(error));
    console.log(error)
  }
}

export function* onGetRoutinesStart() {
  yield takeLatest(RoutineActionTypes.GET_ROUTINES_START, getRoutines);
}

export function* onGetRoutineStart() {
  yield takeLatest(RoutineActionTypes.GET_ROUTINE_START, getRoutine);
}

export function* onCreateroutinesStart() {
  yield takeLatest(RoutineActionTypes.CREATE_ROUTINE_START, createRoutine);
}

export function* onDeleteroutineStart() {
  yield takeLatest(RoutineActionTypes.DELETE_ROUTINE_START, deleteRoutine);
}

export function* routineSagas() {
  yield all([
    call(onGetRoutinesStart),
    call(onGetRoutineStart),
    call(onCreateroutinesStart),
    call(onDeleteroutineStart)
  ]);
}