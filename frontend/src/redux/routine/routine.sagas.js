import { takeLatest, put, all, call } from 'redux-saga/effects';
import RoutineActionTypes from './routine.types';

import {
  getRoutinesSuccess,
  getRoutinesFailure,
  createRoutineSuccess,
  createRoutineFailure,
  deleteRoutineSuccess,
  deleteRoutineFailure
} from './routine.actions';

import {
  userService
} from '../../services/user.service';


export function* getRoutines() {
  try {
    const routines = yield userService.getRoutines();
    yield put(getRoutinesSuccess(routines.data.getRoutines));
  } catch (error) {
    yield put(getRoutinesFailure(error));
  }
}

export function* createRoutine({ payload: { routineInput } }) {
  try {
    const routine = yield userService.createRoutine(routineInput);
    yield put(createRoutineSuccess(routine.data.createRoutine));
  } catch (error) {
    yield put(createRoutineFailure(error));
  }
}

export function* deleteRoutine({ payload: { routineId } }) {
  try {
    const routine = yield userService.deleteRoutine(routineId);
    yield put(deleteRoutineSuccess(routine.data.deleteRoutine));
  } catch (error) {
    yield put(deleteRoutineFailure(error));
    console.log(error)
  }
}

export function* onGetRoutinesStart() {
  yield takeLatest(RoutineActionTypes.GET_ROUTINES_START, getRoutines);
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
    call(onCreateroutinesStart),
    call(onDeleteroutineStart)
  ]);
}