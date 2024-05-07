// reducers/rootReducer.js

import { combineReducers } from 'redux';
import authReducer from './authReducer'; 
import loadingReducer from './loadingReducer';


const rootReducer = combineReducers({
  auth: authReducer,
  loading:loadingReducer,
  // Add other reducers here
});

export default rootReducer;
