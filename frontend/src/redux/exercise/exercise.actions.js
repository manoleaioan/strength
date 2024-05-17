import ExerciseActionTypes from './exercise.types';

export const getExercisesStart = () => ({
  type: ExerciseActionTypes.GET_EXERCISES_START
});

export const getExercisesSuccess = exercises => ({
  type: ExerciseActionTypes.GET_EXERCISES_SUCCESS,
  payload: exercises
});

export const getExercisesFailure = error => ({
  type: ExerciseActionTypes.GET_EXERCISES_FAILURE,
  payload: error
});

export const createExerciseStart = exerciseData => ({
  type: ExerciseActionTypes.CREATE_EXERCISE_START,
  payload: exerciseData
});

export const createExerciseSuccess = exercise => ({
  type: ExerciseActionTypes.CREATE_EXERCISE_SUCCESS,
  payload: exercise
});

export const createExerciseFailure = error => ({
  type: ExerciseActionTypes.CREATE_EXERCISE_FAILURE,
  payload: error
});

export const deleteExerciseStart = exerciseId => ({
  type: ExerciseActionTypes.DELETE_EXERCISE_START,
  payload: exerciseId
});

export const deleteExerciseSuccess = status => ({
  type: ExerciseActionTypes.DELETE_EXERCISE_SUCCESS,
  payload: status
});

export const deleteExerciseFailure = error => ({
  type: ExerciseActionTypes.DELETE_EXERCISE_FAILURE,
  payload: error
});

export const getExerciseChardDataStart = payload => ({
  type: ExerciseActionTypes.GET_EXERCISE_CHART_START,
  payload
});

export const getExerciseChardDataSuccess = status => ({
  type: ExerciseActionTypes.GET_EXERCISE_CHART_SUCCESS,
  payload: status
});

export const getExerciseChardDataFailure = error => ({
  type: ExerciseActionTypes.GET_EXERCISE_CHART_FAILURE,
  payload: error
});