// store.js
import { createStore } from 'redux';
import rootReducer from '../reducers/rootReducer'; // Import your root reducer

const store = createStore(rootReducer); // Create Redux store with rootReducer

export default store;
