import {createWrapper, HYDRATE} from 'next-redux-wrapper';

import {combinedReducers, RootState} from './reducers';

import {applyMiddleware, Store, createStore, AnyAction, Reducer} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const reducer: Reducer<RootState, AnyAction> = (state, action) => {
  console.log('state', action);
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };

    return nextState;
  } else {
    return combinedReducers(state, action);
  }
};

const makeStore = () => {
  const store: Store = createStore(reducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

  return store;
};

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore, {debug: process.env.NODE_ENV === 'development'});
