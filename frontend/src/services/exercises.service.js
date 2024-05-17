import config from './config';
import { authHeader } from './authHeader';
import { handleResponse } from './responseHandler';
import axios from 'axios';

export const exercisesService = {
  getExercises,
  createExercise,
  deleteExercise,
  getExerciseChartData
};

function getExercises() {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getExercises{
          getExercises {
            _id,
            name,
            type,
            maxRep,
            maxVol,
            activityAt
          }
        }
      `
    })
  }).then(handleResponse);
}

function createExercise(exerciseInput) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        mutation($exerciseInput: ExerciseInput!){
          createExercise(exerciseInput: $exerciseInput) {
            _id,
            name,
            type,
            maxRep,
            maxVol,
            activityAt
          }
        }
      `,
      variables: { exerciseInput }
    })
  }).then(handleResponse);
}

function deleteExercise(exerciseId) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        mutation($exerciseId: String!){
          deleteExercise(exerciseId: $exerciseId) 
        }
      `,
      variables: { exerciseId }
    })
  }).then(handleResponse);
}

function getExerciseChartData(chartDataInput) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getExerciseChartData($chartDataInput: chartDataInput){
          getExerciseChartData(chartDataInput: $chartDataInput) {
            repsData {
              date,
              reps
            },
            volData {
              date,
              vol
            }
          }
        }
      `,
      variables: { chartDataInput }
    })
  }).then(handleResponse);
}