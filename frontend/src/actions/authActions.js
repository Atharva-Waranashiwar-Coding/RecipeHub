// actions/authActions.js
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actionTypes';

export const loginSuccess = (token, userType) => ({
  type: LOGIN_SUCCESS,
  payload: { token, userType }
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: { error }
});

export const logout = () => ({
  type: LOGOUT
});
