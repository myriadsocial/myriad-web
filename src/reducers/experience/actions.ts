import {Experience, Tag, UserExperience} from '../../interfaces/experience';
import {People} from '../../interfaces/people';
import * as ExperienceAPI from '../../lib/api/experience';
import * as PeopleAPI from '../../lib/api/people';
import * as TagAPI from '../../lib/api/tag';
import {ThunkActionCreator} from '../../types/thunk';
import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import {ShowToasterSnack, showToasterSnack} from '../toaster-snack/actions';
import * as constants from './constants';

import {Action} from 'redux';
import {ExperienceType} from 'src/components/Timeline/default';

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
export interface LoadDetailExperience extends Action {
  type: constants.FETCH_DETAIL_EXPERIENCE;
  experience: Experience;
}
export interface SearchAllRelatedExperiences extends PaginationAction {
  type: constants.SEARCH_ALL_RELATED_EXPERIENCES;
  experiences: Experience[];
}
export interface SearchExperience extends PaginationAction {
  type: constants.SEARCH_EXPERIENCE;
  experiences: UserExperience[];
}
export interface SearchPeople extends Action {
  type: constants.SEARCH_PEOPLE;
  people: People[];
}
export interface SearchTags extends Action {
  type: constants.SEARCH_TAGS;
  tags: Tag[];
}
/**
 * Union Action Types
 */

export type Actions =
  | LoadAllExperiences
  | LoadExperience
  | LoadDetailExperience
  | SearchExperience
  | SearchAllRelatedExperiences
  | SearchPeople
  | SearchTags
  | ShowToasterSnack
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

export const fetchDetailExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const experience = await ExperienceAPI.getExperience(experienceId);
      dispatch({
        type: constants.FETCH_DETAIL_EXPERIENCE,
        experience: experience,
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
  (experience: Experience, callback?: (id: string) => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const cloneExperience = await ExperienceAPI.createExperience(user.id, experience);
      callback && callback(cloneExperience.id);
      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'Experience succesfully cloned!',
        }),
      );
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

export const searchAllRelatedExperiences: ThunkActionCreator<Actions, RootState> =
  (query: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: experiences} = await ExperienceAPI.searchExperiencesByQuery(query);

      dispatch({
        type: constants.SEARCH_ALL_RELATED_EXPERIENCES,
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
      if (query) {
        const people = await PeopleAPI.searchPeople(query);
        dispatch({
          type: constants.SEARCH_PEOPLE,
          people,
        });
      } else {
        dispatch({
          type: constants.SEARCH_PEOPLE,
          people: [],
        });
      }
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
      if (query) {
        const {meta, data: tags} = await TagAPI.searchTag(query);
        dispatch({
          type: constants.SEARCH_TAGS,
          tags,
          meta,
        });
      } else {
        dispatch({
          type: constants.SEARCH_TAGS,
          tags: [],
        });
      }
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
  (experience: Experience, newTags: string[], callback?: (id: string) => void) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const newExperience = await ExperienceAPI.createExperience(user.id, experience);

      callback && callback(newExperience.id);

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'Experience succesfully created!',
        }),
      );
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

export const subscribeExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.subscribeExperience(user.id, experienceId);

      callback && callback();

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'subscribed successfully!',
        }),
      );
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

export const updateExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, experience: Experience, callback?: (id: string) => void) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.updateExperience(user.id, experienceId, experience);
      await fetchExperience();

      callback && callback(experienceId);

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'experience succesfully updated!',
        }),
      );
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

export const deleteExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.deleteExperience(experienceId);

      callback && callback();
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

export const unsubscribeExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.unsubscribeExperience(experienceId);

      callback && callback();

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'unsubscribed successfully!',
        }),
      );
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
