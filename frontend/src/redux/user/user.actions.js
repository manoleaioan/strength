import UserActionTypes from './user.types';


export const signInSuccess = user => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user
});

export const signInFailure = error => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error
});

export const signInStart = emailAndPassword => ({
  type: UserActionTypes.EMAIL_SIGN_IN_START,
  payload: emailAndPassword
});

export const checkUserSessionStart = () => ({
  type: UserActionTypes.CHECK_USER_SESSION_START
});

export const checkUserSessionEnd = () => ({
  type: UserActionTypes.CHECK_USER_SESSION
});

export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS
});

export const signOutFailure = error => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error
});

export const signUpStart = userCredentials => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: userCredentials
});

export const signUpSuccess = ({ user, additionalData }) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: { user, additionalData }
});

export const signUpFailure = error => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error
});

export const emailVerificationStart = token => ({
  type: UserActionTypes.EMAIL_VERIFICATION_START,
  payload: token
});

export const emailVerificationSuccess = status => ({
  type: UserActionTypes.EMAIL_VERIFICATION_SUCCESS,
  payload: status
});

export const emailVerificationFailure = error => ({
  type: UserActionTypes.EMAIL_VERIFICATION_FAILURE,
  payload: error
});

export const resendActivationStart = uid => ({
  type: UserActionTypes.RESEND_ACTIVATION_START,
  payload: uid
});

export const resendActivationSuccess = status => ({
  type: UserActionTypes.RESEND_ACTIVATION_SUCCESS,
  payload: status
});

export const resendActivationFailure = error => ({
  type: UserActionTypes.RESEND_ACTIVATION_FAILURE,
  payload: error
});

export const sendPwResetStart = email => ({
  type: UserActionTypes.SEND_PWRESET_LINK_START,
  payload: email
});

export const pwResetStart = (token, newPassword) => ({
  type: UserActionTypes.PWRESET_START,
  payload: { token, newPassword }
});

export const pwResetSuccess = status => ({
  type: UserActionTypes.PWRESET_SUCCESS,
  payload: status
});

export const pwResetFailure = error => ({
  type: UserActionTypes.PWRESET_FAILURE,
  payload: error
});

export const imageUploadStart = image => ({
  type: UserActionTypes.IMAGE_UPLOAD_START,
  payload: image
});

export const imageUploadSuccess = url => ({
  type: UserActionTypes.IMAGE_UPLOAD_SUCCESS,
  payload: url
});

export const  updateUserStart = field => ({
  type: UserActionTypes.UPDATE_USER_START,
  payload: field
});

export const updateUserSuccess = user => ({
  type: UserActionTypes.UPDATE_USER_SUCCESS,
  payload: user
});

export const updateUserFailure = error => ({
  type: UserActionTypes.UPDATE_USER_FAILURE,
  payload: error
});

export const resetPwResetResponse = () => ({
  type: UserActionTypes.RESET_PWRESET_RES
})