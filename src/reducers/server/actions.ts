import {Actions as BaseAction, setError, setLoading} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {Server} from 'src/lib/api/server';
import * as ServerAPI from 'src/lib/api/server';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchServer extends Action {
  type: constants.FETCH_SERVER;
  payload: {
    apiURL: string;
    server: Server;
  };
}

/**
 * Union Action Types
 */

export type Actions = FetchServer | BaseAction;

/**
 *
 * Actions
 */

export const setServer = (server: Server, apiURL: string): FetchServer => ({
  type: constants.FETCH_SERVER,
  payload: {
    server,
    apiURL,
  },
});

export const fetchServer: ThunkActionCreator<Actions, RootState> =
  (apiURL: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const currentServer = await ServerAPI.getServer();

      dispatch(setServer(currentServer, apiURL));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
