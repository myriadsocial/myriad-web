import { Actions } from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import { Server } from 'src/lib/api/server';

export interface ServerState {
  apiURL: string;
  server: Server | null;
}

const initalState: ServerState = {
  apiURL: '',
  server: null,
};

export const ServerReducer: Redux.Reducer<ServerState, Actions> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case constants.FETCH_SERVER: {
      return {
        ...state,
        server: action.payload.server,
        apiURL: action.payload.apiURL,
      };
    }

    default: {
      return state;
    }
  }
};
