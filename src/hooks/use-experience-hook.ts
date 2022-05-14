import {useSelector, useDispatch} from 'react-redux';

import {WrappedExperience, ExperienceProps} from '../interfaces/experience';
import {RootState} from '../reducers';

import {pick} from 'lodash';
import {
  searchExperiences,
  searchPeople,
  searchTags,
  cloneExperience,
  loadExperiences,
  createExperience,
  fetchDetailExperience,
  subscribeExperience,
  updateExperience,
  deleteExperience,
  unsubscribeExperience,
  clearExperiences,
  fetchTrendingExperience,
} from 'src/reducers/experience/actions';
import {ExperienceState} from 'src/reducers/experience/reducer';
import {fetchUserExperience} from 'src/reducers/user/actions';

export enum ExperienceOwner {
  ALL = 'all',
  CURRENT_USER = 'current_user',
  PROFILE = 'profile',
  TRENDING = 'trending',
}

//TODO: isn't it better to rename this to something more general like, useSearchHook?
// it's not obvious if we want to searchPeople we can use this hook
export const useExperienceHook = () => {
  const dispatch = useDispatch();

  const {
    experiences,
    trendingExperiences,
    selectedExperience,
    searchTags: tags,
    searchPeople: people,
    detail: experience,
    hasMore,
    meta,
    loading,
  } = useSelector<RootState, ExperienceState>(state => state.experienceState);
  const profileExperiences = useSelector<RootState, WrappedExperience[]>(
    state => state.profileState.experience.data,
  );
  const userExperiences = useSelector<RootState, WrappedExperience[]>(
    state => state.userState.experiences,
  );

  const loadExperience = () => {
    dispatch(loadExperiences());
  };

  const loadTrendingExperience = () => {
    dispatch(fetchTrendingExperience());
  };

  const nextPage = async () => {
    const page = meta.currentPage + 1;

    dispatch(loadExperiences(page));
  };

  const getExperienceDetail = (experienceId: string | string[]) => {
    const id = experienceId as string;
    dispatch(fetchDetailExperience(id));
  };

  const findExperience = async (query: string, page = 1) => {
    dispatch(searchExperiences(query, page));
  };

  const findPeople = (query: string) => {
    dispatch(searchPeople(query));
  };

  const findTags = (query: string) => {
    dispatch(searchTags(query));
  };

  const followExperience = (
    experienceId: string,
    newExperience: ExperienceProps,
    callback?: (id: string) => void,
  ) => {
    const attributes = pick(newExperience, [
      'name',
      'description',
      'allowedTags',
      'experienceImageURL',
      'prohibitedTags',
      'people',
    ]);

    dispatch(cloneExperience(experienceId, attributes, callback));
  };

  const editExperience = (
    experienceId: string,
    newExperience: ExperienceProps,
    callback?: (id: string) => void,
  ) => {
    const attributes = pick(newExperience, [
      'name',
      'description',
      'allowedTags',
      'experienceImageURL',
      'prohibitedTags',
      'people',
    ]);

    dispatch(updateExperience(experienceId, attributes, callback));
  };

  const saveExperience = (newExperience: ExperienceProps, callback?: (id: string) => void) => {
    dispatch(createExperience(newExperience, callback));
  };

  const beSubscribeExperience = (experienceId: string, callback?: () => void) => {
    dispatch(
      subscribeExperience(experienceId, () => {
        dispatch(fetchUserExperience());
        callback && callback();
      }),
    );
  };

  const removeExperience = (experienceId: string, callback?: () => void) => {
    dispatch(
      deleteExperience(experienceId, () => {
        dispatch(fetchUserExperience());

        callback && callback();
      }),
    );
  };

  const beUnsubscribeExperience = (experienceId: string, callback?: () => void) => {
    dispatch(
      unsubscribeExperience(experienceId, () => {
        dispatch(fetchUserExperience());
        callback && callback();
      }),
    );
  };

  const clear = () => {
    dispatch(clearExperiences());
  };

  return {
    loading,
    page: meta.currentPage,
    hasMore,
    experiences,
    trendingExperiences,
    userExperiences,
    profileExperiences,
    experience,
    selectedExperience,
    tags,
    people,
    loadExperience,
    nextPage,
    searchExperience: findExperience,
    searchPeople: findPeople,
    searchTags: findTags,
    cloneExperience: followExperience,
    saveExperience,
    getExperienceDetail,
    subscribeExperience: beSubscribeExperience,
    updateExperience: editExperience,
    removeExperience,
    unsubscribeExperience: beUnsubscribeExperience,
    clearExperiences: clear,
    loadTrendingExperience,
  };
};
