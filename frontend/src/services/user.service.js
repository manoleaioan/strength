import config from './config';
import { authHeader } from './authHeader';
import axios from 'axios';

export const userService = {
  login,
  register,
  getUserData,
  verifyEmail,
  resendActivation,
  sendPwResetLink,
  resetPassword,
  uploadImage,
  updateUserData,
  getExercises,
  createExercise,
  deleteExercise,
  getRoutines,
  createRoutine,
  deleteRoutine
};

function register(user) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      query: `
        mutation CreateUser($email: String!, $password: String!, $username: String!, $fullName: String!){
          createUser(userInput: {email: $email, password: $password, username: $username, fullName: $fullName}) {
            _id,
            email,
            username,
            fullName,
            token,
            verified
          }
        }
    `,
      variables: { ...user }
    })
  }).then(handleResponse);
}

function login(user) {
  return axios.post(config.apiUrl, {
    query: `
      query($email: String!, $password: String!){
        login(email: $email, password: $password) {
          token,
          user {
            _id,
            email,
            username,
            fullName,
            verified,
            profilePicture
          }
        }
      }
    `,
    variables: { ...user }
  }).then(handleResponse);
}

function verifyEmail(token) {
  return axios.post(config.apiUrl, {
    query: `
    mutation($token: String!){
        verifyEmail(token: $token) {
          verified
        }
      }
    `,
    variables: { token }
  }).then(handleResponse);
}

function resendActivation(uid) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
      mutation($uid: String!){
        resendActivation(uid: $uid)
      }
      `,
      variables: { uid }
    })
  }).then(handleResponse);
}

function sendPwResetLink(email) {
  return axios.post(config.apiUrl, {
    query: `
    mutation($email: String!){
      sendPwResetLink(email: $email)
    }
    `,
    variables: { email }
  }).then(handleResponse);
}

function resetPassword(token, newPassword) {
  return axios.post(config.apiUrl, {
    query: `
    mutation($token: String!, $newPassword: String!){
      resetPassword(token: $token, newPassword: $newPassword)
    }
    `,
    variables: { token, newPassword }
  }).then(handleResponse);
}

function updateUserData(userInput) {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
      mutation($userInput: UpdateUser!){
        updateUserData(userInput: $userInput){
          _id,
          email,
          username,
          fullName,
          verified,
          profilePicture
        }
      }
      `,
      variables: { userInput }
    })
  }).then(handleResponse);
}

function uploadImage(file) {
  const formData = new FormData();
  const operations = `{ "query": "mutation ($file: Upload!) { changeProfilePicture(file: $file)  }", "variables": { "file": null } }`;

  formData.append("operations", operations);
  const map = `{"0": ["variables.file"]}`;
  formData.append("map", map)
  formData.append("0", file)

  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: formData
  }).then(handleResponse);
}

function getUserData() {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getData{
          getUserData {
            _id,
            email,
            username,
            fullName,
            verified,
            profilePicture
          }
        }
      `
    })
  }).then(handleResponse);
}

// Exercises

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

// Routines

function getRoutines() {
  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: authHeader(),
    data: JSON.stringify({
      query: `
        query getRoutines{
          getRoutines {
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
      `
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

function handleResponse(response) {
  const { data } = response

  console.log(response)
  if (data && data.errors) {

    if (response.status === 401) {
      // auto logout if 401 response returned from api
      //logout();
      //location.reload(true);
    }
    console.log("erori")
    const error = (data && data.errors[0]) || response.statusText;
    if (error?.message === "Unauthorized") {
      window.location.reload(false);
    }
    return Promise.reject(error);
  }
  return data;
}