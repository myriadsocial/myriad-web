import {Experience, Tag, UserExperience} from '../../interfaces/experience';
import {People} from '../../interfaces/people';
import * as ExperienceAPI from '../../lib/api/experience';
import * as PeopleAPI from '../../lib/api/people';
import * as TagAPI from '../../lib/api/tag';
import {ThunkActionCreator} from '../../types/thunk';
import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {ExperienceType} from 'src/components-v2/Timeline/default';

/**
 * Action Types
 */

export interface LoadAllExperiences extends PaginationAction {
  type: constants.FETCH_ALL_EXPERIENCES;
  allExperiences: Experience[];
}
export interface LoadExperience extends PaginationAction {
  type: constants.FETCH_EXPERIENCE;
  experiences: UserExperience[];
}
export interface SelectExperience extends Action {
  type: constants.SELECT_EXPERIENCE;
  selectedExperience: Experience;
}
export interface AddExperience extends Action {
  type: constants.ADD_EXPERIENCE;
  addedExperience: Experience;
}
export interface UpdateSelectedExperience extends Action {
  type: constants.UPDATE_SELECTED_EXPERIENCE;
  updatedExperience: Experience;
}
export interface RemoveExperience extends Action {
  type: constants.REMOVE_EXPERIENCE;
  removedExperienceId: string;
}
export interface SearchExperience extends PaginationAction {
  type: constants.SEARCH_EXPERIENCE;
  experiences: UserExperience[];
}
export interface SearchPeople extends PaginationAction {
  type: constants.SEARCH_PEOPLE;
  people: People[];
}
export interface SearchTags extends PaginationAction {
  type: constants.SEARCH_TAGS;
  tags: Tag[];
}
/**
 * Union Action Types
 */

export type Actions =
  | LoadAllExperiences
  | LoadExperience
  | AddExperience
  | SelectExperience
  | UpdateSelectedExperience
  | RemoveExperience
  | SearchExperience
  | SearchPeople
  | SearchTags
  | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */

export const fetchAllExperiences: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: allExperiences} = await ExperienceAPI.getAllExperiences();

      dispatch({
        type: constants.FETCH_ALL_EXPERIENCES,
        allExperiences,
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

export const fetchExperience: ThunkActionCreator<Actions, RootState> =
  (type?: ExperienceType) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: experiences} = await ExperienceAPI.getUserExperience(user.id, type);

      dispatch({
        type: constants.FETCH_EXPERIENCE,
        experiences,
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

export const addExperience: ThunkActionCreator<Actions, RootState> =
  (experience: Experience) => async dispatch => {
    dispatch(setLoading(true));
    try {
      const data = await ExperienceAPI.createUserExperience(experience);

      dispatch({
        type: constants.ADD_EXPERIENCE,
        addedExperience: data,
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

export const removeExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.removeExperience(experienceId);

      dispatch({
        type: constants.REMOVE_EXPERIENCE,
        removedExperienceId: experienceId,
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

export const selectExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const data = await ExperienceAPI.chooseExperience(user.id, experienceId);

      dispatch({
        type: constants.SELECT_EXPERIENCE,
        selectedExperience: data,
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

export const cloneExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.cloneExperience(user.id, experienceId);
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

export const searchExperience: ThunkActionCreator<Actions, RootState> =
  (query: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: experiences} = await ExperienceAPI.searchExperience(query);

      dispatch({
        type: constants.SEARCH_EXPERIENCE,
        experiences,
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

export const searchPeople: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {meta, data: people} = await PeopleAPI.searchPeople(query);
      dispatch({
        type: constants.SEARCH_PEOPLE,
        people,
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

export const searchTags: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {meta, data: tags} = await TagAPI.searchTag(query);
      dispatch({
        type: constants.SEARCH_TAGS,
        tags,
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

export const createExperience: ThunkActionCreator<Actions, RootState> =
  (experience: Experience, newTags: string[]) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.createExperience(user.id, experience);
      fetchExperience();
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
