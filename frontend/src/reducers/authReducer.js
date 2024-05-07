// reducers/authReducer.js
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/actionTypes';

const initialState = {
  loggedIn: false,
  userType: null,
  token:null,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        userType: action.payload.userType,
        token: action.payload.token,
        error: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
        userType: null,
        token:null,
        error: action.payload.error
      };
    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
        userType: null,
        token: null,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;
