import config from './config';
import { authHeader } from './authHeader';
import { handleResponse } from './responseHandler';
import axios from 'axios';

export const routinesService = {
  getRoutines,
  createRoutine,
  deleteRoutine,
};

function getRoutines(routineId) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getRoutines($routineId: String){
          getRoutines(routineId: $routineId) {
            _id,
            name,
            color,
            lastWorkoutDate,
            workoutsComplete,
            chartData {
              date,
              vol
            },
            exercises{
              _id, superset {
                _id,
                exId {
                  _id,
                  name,
                  type,
                  maxRep,
                  maxVol,
                  activityAt
                }
              },
              exId {
                _id,
                name,
                type,
                maxRep,
                maxVol,
                activityAt
              }
            }
          }
        }
      `,
      variables: { routineId }
    })
  }).then(handleResponse);
}

function createRoutine(routineInput) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        mutation($routineInput: RoutineInput!){
          createRoutine(routineInput: $routineInput) {
            _id,
            name,
            color,
            exercises{
              _id, superset {
                _id,
                exId {
                  _id,
                  name,
                  type,
                  maxRep,
                  maxVol,
                  activityAt
                }
              },
              exId {
                _id,
                name,
                type,
                maxRep,
                maxVol,
                activityAt
              }
            }
          }
        }
      `,
      variables: { routineInput }
    })
  }).then(handleResponse);
}

function deleteRoutine(routineId) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        mutation($routineId: String!){
          deleteRoutine(routineId: $routineId) 
        }
      `,
      variables: { routineId }
    })
  }).then(handleResponse);
}