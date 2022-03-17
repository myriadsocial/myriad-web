import {useSelector, useDispatch} from 'react-redux';

import {Experience, WrappedExperience} from '../interfaces/experience';
import {RootState} from '../reducers';

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
} from 'src/reducers/experience/actions';
import {ExperienceState} from 'src/reducers/experience/reducer';
import {fetchUserExperience} from 'src/reducers/user/actions';

export enum ExperienceOwner {
  ALL = 'all',
  CURRENT_USER = 'current_user',
  PROFILE = 'profile',
}

//TODO: isn't it better to rename this to something more general like, useSearchHook?
// it's not obvious if we want to searchPeople we can use this hook
export const useExperienceHook = () => {
  const dispatch = useDispatch();

  const {
    experiences,
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
    newExperience: Partial<Experience>,
    newTags: string[],
    callback?: (id: string) => void,
  ) => {
    const experience: Partial<Experience> = {
      name: newExperience.name,
      tags: newTags,
      people: newExperience.people,
      description: newExperience.description,
      experienceImageURL: newExperience.experienceImageURL,
    };

    dispatch(cloneExperience(experience, callback));
  };

  const editExperience = (
    newExperience: Partial<Experience>,
    newAllowedTags: string[],
    newProhibitedTags: string[],
    callback?: (id: string) => void,
  ) => {
    const experience: Partial<Experience> = {
      name: newExperience.name,
      allowedTags: newAllowedTags,
      prohibitedTags: newProhibitedTags,
      people: newExperience.people,
      description: newExperience.description,
      experienceImageURL: newExperience.experienceImageURL,
    };

    dispatch(updateExperience(newExperience.id, experience, callback));
  };

  const saveExperience = (
    newExperience: Partial<Experience>,
    newTags: string[],
    callback?: (id: string) => void,
  ) => {
    const experience = {...newExperience, allowedTags: newTags};
    dispatch(createExperience(experience, newTags, callback));
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
  };
};
