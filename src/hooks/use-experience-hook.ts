import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Experience} from '../interfaces/experience';
import {RootState} from '../reducers';
import {
  searchExperience,
  searchPeople,
  searchTags,
  cloneExperience,
  fetchExperience,
  fetchAllExperiences,
  createExperience,
  fetchDetailExperience,
  subscribeExperience,
  updateExperience,
  deleteExperience,
} from '../reducers/experience/actions';
import {ExperienceState} from '../reducers/experience/reducer';

//TODO: isn't it better to rename this to something more general like, useSearchHook?
// it's not obvious if we want to searchPeople we can use this hook
export const useExperienceHook = () => {
  const dispatch = useDispatch();

  const {
    experiences,
    allExperiences,
    selectedExperience,
    searchTags: tags,
    searchPeople: people,
    searchExperience: searchedExperiences,
    detail: experience,
  } = useSelector<RootState, ExperienceState>(state => state.experienceState);

  useEffect(() => {
    loadExperience();
    loadAllExperiences();
  }, []);

  const loadAllExperiences = () => {
    dispatch(fetchAllExperiences());
  };

  const loadExperience = () => {
    dispatch(fetchExperience());
  };

  const getDetail = (experienceId: string | string[]) => {
    const id = experienceId as string;
    dispatch(fetchDetailExperience(id));
  };

  const findExperience = (query: string) => {
    dispatch(searchExperience(query));
  };

  const findPeople = (query: string) => {
    dispatch(searchPeople(query));
  };

  const findTags = (query: string) => {
    dispatch(searchTags(query));
  };

  const followExperience = (newExperience: Partial<Experience>, newTags: string[]) => {
    const experience = {
      name: newExperience.name,
      tags: newTags,
      peole: newExperience.people,
      description: newExperience.description,
      experienceImageURL: newExperience.experienceImageURL,
    };
    dispatch(cloneExperience(newExperience.id, experience));
  };

  const editExperience = (
    newExperience: Partial<Experience>,
    newTags: string[],
    callback?: (id: string) => void,
  ) => {
    const experience = {
      name: newExperience.name,
      tags: newTags,
      peole: newExperience.people,
      description: newExperience.description,
      experienceImageURL: newExperience.experienceImageURL,
    };
    dispatch(updateExperience(newExperience.id, experience));
  };

  const saveExperience = (
    newExperience: Partial<Experience>,
    newTags: string[],
    callback?: (id: string) => void,
  ) => {
    const experience = {...newExperience, tags: newTags};
    dispatch(createExperience(experience, newTags, callback));
  };

  const beSubscribeExperience = (experienceId: string) => {
    dispatch(subscribeExperience(experienceId));
  };

  const removeExperience = (experienceId: string, callback?: () => void) => {
    dispatch(deleteExperience(experienceId, callback));
  };

  return {
    searchPeople: findPeople,
    searchExperience: findExperience,
    searchedExperiences,
    searchTags: findTags,
    cloneExperience: followExperience,
    loadExperience,
    experiences,
    selectedExperience,
    loadAllExperiences,
    allExperiences,
    saveExperience,
    tags,
    people,
    getDetail,
    experience,
    subscribeExperience: beSubscribeExperience,
    updateExperience: editExperience,
    removeExperience,
  };
};
