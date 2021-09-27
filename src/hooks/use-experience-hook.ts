import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../reducers';
import {
  searchExperience,
  searchPeople,
  searchTags,
  cloneExperience,
  fetchExperience,
  fetchAllExperiences,
} from '../reducers/experience/actions';
import {ExperienceState} from '../reducers/experience/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useExperienceHook = () => {
  const dispatch = useDispatch();

  const {experiences, allExperiences} = useSelector<RootState, ExperienceState>(
    state => state.experienceState,
  );

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

  const findExperience = (query: string) => {
    dispatch(searchExperience(query));
  };

  const findPeople = (query: string) => {
    dispatch(searchPeople(query));
  };

  const findTags = (query: string) => {
    dispatch(searchTags(query));
  };

  const followExperience = (experienceId: string) => {
    dispatch(cloneExperience(experienceId));
  };

  return {
    searchPeople: findPeople,
    searchExperience: findExperience,
    searchTags: findTags,
    followExperience,
    loadExperience,
    experiences,
    loadAllExperiences,
    allExperiences,
  };
};
