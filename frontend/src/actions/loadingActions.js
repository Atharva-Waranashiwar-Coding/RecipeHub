// actions/loadingActions.js

import { SET_LOADING } from './actionTypes';

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});
