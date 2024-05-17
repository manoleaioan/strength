import config from './config';
import { authHeader } from './authHeader';
import { handleResponse } from './responseHandler';
import axios from 'axios';

export const metricsService = {
  getMetrics,
};

function getMetrics(date) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getMetrics($date: inputDate){
          getMetrics(date: $date) {
            general{
              workouts,
              exercises,
              sets,
              reps
            },
            routines{
              name,
              val,
              color
            },
            exercises{
              name,
              val,
              color
            }
          }
        }
      `,
      variables: { date }
    })
  }).then(handleResponse);
}