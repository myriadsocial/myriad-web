import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Importer} from 'src/interfaces/user';
import * as ImporterAPI from 'src/lib/api/importers';
import {ThunkActionCreator} from 'src/types/thunk';

export interface LoadImporters extends PaginationAction {
  type: constants.FETCH_IMPORTER;
  importers: Importer[];
}

/**
 * Union Action Types
 */

export type Actions = LoadImporters | BaseAction;

export const fetchImporter: ThunkActionCreator<Actions, RootState> =
  (originPostId: string, platform: string, postCreator?: string, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      userState: {user},
    } = getState();

    try {
      const {meta, data: importers} = await ImporterAPI.getImporters(
        originPostId,
        platform,
        user?.id as string,
        page,
      );

      dispatch({
        type: constants.FETCH_IMPORTER,
        importers: importers.filter(importer => importer && importer.id !== postCreator),
        meta,
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const removeImporter: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setLoading(true));

  try {
    dispatch({
      type: constants.FETCH_IMPORTER,
      importers: [],
      meta: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItemCount: 0,
        totalPageCount: 0,
      },
    });
  } catch (error) {
    dispatch(
      setError({
        message: error.message,
      }),
    );
  } finally {
    dispatch(setLoading(false));
  }
};
