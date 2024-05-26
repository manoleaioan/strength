import RoutineActionTypes from './routine.types';

export const getRoutinesStart = () => ({
  type: RoutineActionTypes.GET_ROUTINES_START
});

export const getRoutinesSuccess = routines => ({
  type: RoutineActionTypes.GET_ROUTINES_SUCCESS,
  payload: routines
});

export const getRoutinesFailure = error => ({
  type: RoutineActionTypes.GET_ROUTINES_FAILURE,
  payload: error
});

export const createRoutineStart = routineData => ({
  type: RoutineActionTypes.CREATE_ROUTINE_START,
  payload: routineData
});

export const createRoutineSuccess = routine => ({
  type: RoutineActionTypes.CREATE_ROUTINE_SUCCESS,
  payload: routine
});

export const createRoutineFailure = error => ({
  type: RoutineActionTypes.CREATE_ROUTINE_FAILURE,
  payload: error
});

export const deleteRoutineStart = routineId => ({
  type: RoutineActionTypes.DELETE_ROUTINE_START,
  payload: routineId
});

export const deleteRoutineSuccess = status => ({
  type: RoutineActionTypes.DELETE_ROUTINE_SUCCESS,
  payload: status
});

export const deleteRoutineFailure = error => ({
  type: RoutineActionTypes.DELETE_ROUTINE_FAILURE,
  payload: error
});

export const updateWorkout = workout => ({
  type: RoutineActionTypes.UPDATE_WORKOUT,
  payload: workout
})