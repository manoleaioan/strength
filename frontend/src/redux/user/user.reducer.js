import UserActionTypes from './user.types';

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  error: null,
  verification_res: null,
  resendActivation_res: null,
  pwReset_res: null,
  updateUserError: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
        updateUserError: null,
        resendActivation_res: null
      };
    case UserActionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
        updateUserError: null,
        resendActivation_res: 'updated'
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        state: INITIAL_STATE,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_OUT_FAILURE:
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case UserActionTypes.CHECK_USER_SESSION:
      return {
        ...state,
        isLoading: false,
      }
    case UserActionTypes.EMAIL_VERIFICATION_SUCCESS:
    case UserActionTypes.EMAIL_VERIFICATION_FAILURE:
      return {
        ...state,
        verification_res: action.payload
      }
    case UserActionTypes.RESEND_ACTIVATION_SUCCESS:
    case UserActionTypes.RESEND_ACTIVATION_FAILURE:
      return {
        ...state,
        resendActivation_res: action.payload
      }
    // case UserActionTypes.PWRESET_START:
    case UserActionTypes.PWRESET_SUCCESS:
    case UserActionTypes.PWRESET_FAILURE:
      return {
        ...state,
        pwReset_res: action.payload
      }
    case UserActionTypes.IMAGE_UPLOAD_SUCCESS:
      return {
        ...state,
        updateUserError: null,
        currentUser: {
          ...state.currentUser,
          profilePicture: action.payload
        }
      }
    case UserActionTypes.UPDATE_USER_FAILURE:
      return {
        ...state,
        updateUserError: action.payload
      }
    case UserActionTypes.RESET_PWRESET_RES:
      return {
        ...state,
        pwReset_res: null
      }
    default:
      return state;
  }
};

export default userReducer;