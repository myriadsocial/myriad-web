import {createWrapper, HYDRATE} from 'next-redux-wrapper';

import {combinedReducers, RootState} from './reducers';
import {DESTROY_SESSION} from './reducers/user/constants';

import {applyMiddleware, Store, createStore, AnyAction, Reducer} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const reducer: Reducer<RootState, AnyAction> = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };

    return nextState;
  } else if (action.type === DESTROY_SESSION) return (state = state);
  else {
    return combinedReducers(state, action);
  }
};

const makeStore = () => {
  const enhancers =
    process.env.NODE_ENV === 'production'
      ? applyMiddleware(thunkMiddleware)
      : composeWithDevTools(applyMiddleware(thunkMiddleware));

  const store: Store = createStore(reducer, enhancers);

  return store;
};

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore, {debug: false});
