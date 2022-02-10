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
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';

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

export interface LoadSearchedExperiences extends Action {
  type: constants.LOAD_SEARCHED_EXPERIENCES;
  payload: {
    experiences: Experience[];
    meta: ListMeta;
  };
}

export interface SearchAllRelatedExperiences extends Action {
  type: constants.SEARCH_ALL_RELATED_EXPERIENCES;
  payload: {
    experiences: Experience[];
    meta: ListMeta;
  };
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

export interface ExperienceLoading extends Action {
  type: constants.EXPERIENCE_LOADING;
  loading: boolean;
}

export interface ClearExperiences extends Action {
  type: constants.CLEAR_EXPERIENCES;
}

/**
 * Union Action Types
 */

export type Actions =
  | LoadAllExperiences
  | LoadExperience
  | LoadDetailExperience
  | SearchExperience
  | LoadSearchedExperiences
  | SearchAllRelatedExperiences
  | SearchPeople
  | SearchTags
  | ShowToasterSnack
  | ExperienceLoading
  | ClearExperiences
  | BaseAction;

/**
 *
 * Actions
 */

export const setExperienceLoading = (loading: boolean): ExperienceLoading => ({
  type: constants.EXPERIENCE_LOADING,
  loading,
});

export const clearExperiences = (): ClearExperiences => ({
  type: constants.CLEAR_EXPERIENCES,
});

/**
 * Action Creator
 */

export const fetchAllExperiences: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setExperienceLoading(true));
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
      dispatch(setExperienceLoading(false));
    }
  };

export const fetchExperience: ThunkActionCreator<Actions, RootState> =
  (type?: ExperienceType) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user, anonymous},
      } = getState();

      if (anonymous) {
        const {data: experiences, meta} = await ExperienceAPI.getAnonymousExperience();
        const _newExperience: UserExperience[] = experiences.map(exp => {
          return {
            id: exp.id,
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt,
            experienceId: exp.id,
            subscribed: false,
            experience: exp,
          };
        });
        dispatch({
          type: constants.FETCH_EXPERIENCE,
          experiences: _newExperience,
          meta,
        });
      } else {
        if (!user) return;
        const {meta, data: experiences} = await ExperienceAPI.getUserExperience(user.id, type);
        dispatch({
          type: constants.FETCH_EXPERIENCE,
          experiences,
          meta,
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

export const loadSearchedExperiences: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
    dispatch(setExperienceLoading(true));

    const {
      userState: {user},
    } = getState();

    try {
      const userId = user?.id as string;

      const {data: experiences, meta} = await ExperienceAPI.getSearchedExperiences(page, userId);

      dispatch({
        type: constants.LOAD_SEARCHED_EXPERIENCES,
        payload: {
          experiences,
          meta,
        },
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setExperienceLoading(false));
    }
  };

export const searchAllRelatedExperiences: ThunkActionCreator<Actions, RootState> =
  (query: string, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setExperienceLoading(true));

    try {
      const {data: experiences, meta} = await ExperienceAPI.searchExperiencesByQuery(query, page);

      dispatch({
        type: constants.LOAD_SEARCHED_EXPERIENCES,
        payload: {
          experiences,
          meta,
        },
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setExperienceLoading(false));
    }
  };

export const searchExperience: ThunkActionCreator<Actions, RootState> =
  (query: string) => async (dispatch, getState) => {
    dispatch(setExperienceLoading(true));

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
      dispatch(setExperienceLoading(false));
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
