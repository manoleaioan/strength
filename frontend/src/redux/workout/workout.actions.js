import WorkoutActionTypes from './workout.types';


export const getWorkoutsStart = date => ({
  type: WorkoutActionTypes.GET_WORKOUTS_START,
  payload: date
});

export const getWorkoutsSuccess = workouts => ({
  type: WorkoutActionTypes.GET_WORKOUTS_SUCCESS,
  payload: workouts
});

export const getWorkoutsFailure = error => ({
  type: WorkoutActionTypes.GET_WORKOUTS_FAILURE,
  payload: error
});

export const createWorkoutStart = (workoutData, callback) => ({
  type: WorkoutActionTypes.CREATE_WORKOUT_START,
  payload: workoutData,
  callback
});

export const createWorkoutSuccess = workout => ({
  type: WorkoutActionTypes.CREATE_WORKOUT_SUCCESS,
  payload: workout
});

export const createWorkoutFailure = error => ({
  type: WorkoutActionTypes.CREATE_WORKOUT_FAILURE,
  payload: error
});

export const deleteWorkoutStart = workoutId => ({
  type: WorkoutActionTypes.DELETE_WORKOUT_START,
  payload: workoutId
});

export const deleteWorkoutSuccess = status => ({
  type: WorkoutActionTypes.DELETE_WORKOUT_SUCCESS,
  payload: status
});

export const deleteWorkoutFailure = error => ({
  type: WorkoutActionTypes.DELETE_WORKOUT_FAILURE,
  payload: error
});

export const getWorkoutDaysStart = (payload, callback) => ({
  type: WorkoutActionTypes.GET_WORKOUT_DAYS_START,
  payload: payload,
  callback
});

export const getWorkoutDaysSuccess = dates => ({
  type: WorkoutActionTypes.GET_WORKOUT_DAYS_SUCCESS,
  payload: dates
});

export const getWorkoutDaysFailure = error => ({
  type: WorkoutActionTypes.GET_WORKOUT_DAYS_FAILURE,
  payload: error
});