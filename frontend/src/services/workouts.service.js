import config from './config';
import { authHeader } from './authHeader';
import { handleResponse } from './responseHandler';
import axios from 'axios';

export const workoutsService = {
  getWorkouts,
  createWorkout,
  deleteWorkout,
  getWorkoutDays
};

function getWorkouts(date) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getWorkouts($date: String){
          getWorkouts(date: $date) {
            _id,
            name,
            color,
            startDate,
            endDate,
            routineId,
            exercises{
              _id,
              records {
                record,
                weight
              },
              prevRecords {
                record,
                weight
              },
              superset {
                _id,
                records {
                  record,
                  weight
                },
                prevRecords {
                  record,
                  weight
                },
                exId {
                  _id,
                  name,
                  type
                }
              },
              exId {
                _id,
                name,
                type
              }
            }
          }
        }
      `,
      variables: { date }
    })
  }).then(handleResponse);
}

function createWorkout(workoutInput) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        mutation($workoutInput: WorkoutInput!){
          createWorkout(workoutInput: $workoutInput) {
            _id,
            name,
            color,
            startDate,
            routineId,
            exercises{
              _id, 
              records {
                record,
                weight
              },
              prevRecords {
                record,
                weight
              },
              superset {
                _id,
                records {
                  record,
                  weight
                },
                prevRecords {
                  record,
                  weight
                },
                exId {
                  _id,
                  name,
                  type,
                }
              },
              exId {
                _id,
                name,
                type
              }
            }
          }
        }
      `,
      variables: { workoutInput }
    })
  }).then(handleResponse);
}

function deleteWorkout(workoutId) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        mutation($workoutId: String!){
          deleteWorkout(workoutId: $workoutId) 
        }
      `,
      variables: { workoutId }
    })
  }).then(handleResponse);
}

function getWorkoutDays(year, utcOffset){
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getWorkoutDays($year: String!, $utcOffset: String){
          getWorkoutDays(year: $year, utcOffset: $utcOffset)
        }
      `,
      variables: { year, utcOffset }
    })
  }).then(handleResponse);
}