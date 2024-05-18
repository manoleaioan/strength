import config from './config';
import { authHeader } from './authHeader';
import { handleResponse } from './responseHandler';
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
  updateUserData
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
  formData.append("0", file);

  return axios({
    method: 'POST',
    url: config.apiUrl,
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
  }).then(handleResponse)
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