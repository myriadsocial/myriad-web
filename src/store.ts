import {createWrapper} from 'next-redux-wrapper';

import {combinedReducers} from './reducers';

import {applyMiddleware, Store, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const makeStore = () => {
  const store: Store = createStore(
    combinedReducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );

  return store;
};

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore);
