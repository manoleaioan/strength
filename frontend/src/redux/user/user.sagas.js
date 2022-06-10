import { takeLatest, put, all, call } from 'redux-saga/effects';
import UserActionTypes from './user.types';

import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signUpSuccess,
  signUpFailure,
  checkUserSessionEnd,
  signOutStart,
  signOutFailure,
  emailVerificationSuccess,
  emailVerificationFailure,
  resendActivationSuccess,
  resendActivationFailure,
  pwResetSuccess,
  pwResetFailure,
  imageUploadSuccess,
  updateUserFailure,
  updateUserSuccess
} from './user.actions';

import {
  userService
} from '../../services/user.service';


export function* signInWithEmail({ payload }) {
  try {
    const user = yield userService.login(payload);
    localStorage.setItem('token', user.data.login.token)
    yield put(signInSuccess(user.data.login.user));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* isUserAuthenticated() {
  try {
    if (localStorage.getItem('token')) {
      const user = yield userService.getUserData();
      yield put(signInSuccess(user.data.getUserData));
    }
  } catch (error) {
    if (error.message === "Unauthorized") {
      localStorage.removeItem('token')
      yield put(signInFailure(error));
      yield put(signOutStart())
    } else {
      alert(error.message);
    }
  }
  yield put(checkUserSessionEnd());
}

export function* signOut() {
  try {
    window.localStorage.removeItem("token");
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* signUp({ payload }) {
  try {
    const user = yield userService.register(payload);
    yield put(signUpSuccess({ user }));
  } catch (error) {
    yield put(signUpFailure(error));
  }
}

export function* signInAfterSignUp({ payload: { user } }) {
  localStorage.setItem('token', user.data.createUser.token)
  yield put(signInSuccess(user.data.createUser))
}

export function* verifyEmail({ payload: { token } }) {
  try {
    let user = yield userService.verifyEmail(token);
    yield put(emailVerificationSuccess(user.data.verifyEmail));
  } catch (error) {
    yield put(emailVerificationFailure(error));
  }
}

export function* resendActivation({ payload: { uid } }) {
  try {
    let res = yield userService.resendActivation(uid);
    yield put(resendActivationSuccess(res.data.resendActivation));
  } catch (error) {
    yield put(resendActivationFailure(error));
  }
}

export function* sendPwResetLink({ payload: { email } }) {
  try {
    let res = yield userService.sendPwResetLink(email);
    yield put(pwResetSuccess(res.data.sendPwResetLink));
  } catch (error) {
    yield put(pwResetFailure(error));
  }
}

export function* resetPassword({ payload: { token, newPassword } }) {
  try {
    let res = yield userService.resetPassword(token, newPassword);
    yield put(pwResetSuccess(res.data.resetPassword));
  } catch (error) {
    yield put(pwResetFailure(error));
  }
}

export function* changeUserProfilePicture({ payload: { file } }) {
  try {
    let res = yield userService.uploadImage(file);
    yield put(imageUploadSuccess(res.data.changeProfilePicture));
  } catch (error) {
    yield put(updateUserFailure(error.message));
  }
}

export function* updateUserData({ payload: { userInput } }) {
  try {
    let res = yield userService.updateUserData(userInput);
    yield put(updateUserSuccess(res.data.updateUserData));
  } catch (error) {
    yield put(updateUserFailure(error));
  }
}

export function* onEmailSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSessionStart() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION_START, isUserAuthenticated);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onEmailVerificationStart() {
  yield takeLatest(UserActionTypes.EMAIL_VERIFICATION_START, verifyEmail);
}

export function* onResendActivationStart() {
  yield takeLatest(UserActionTypes.RESEND_ACTIVATION_START, resendActivation);
}

export function* onSendPwResetStart() {
  yield takeLatest(UserActionTypes.SEND_PWRESET_LINK_START, sendPwResetLink);
}

export function* onResetPasswordStart() {
  yield takeLatest(UserActionTypes.PWRESET_START, resetPassword);
}

export function* onImageUploadStart() {
  yield takeLatest(UserActionTypes.IMAGE_UPLOAD_START, changeUserProfilePicture);
}

export function* onUserUpdateStart() {
  yield takeLatest(UserActionTypes.UPDATE_USER_START, updateUserData);
}

export function* userSagas() {
  yield all([
    call(onCheckUserSessionStart),
    call(onEmailSignInStart),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onEmailVerificationStart),
    call(onResendActivationStart),
    call(onSendPwResetStart),
    call(onResetPasswordStart),
    call(onImageUploadStart),
    call(onUserUpdateStart)
  ]);
}