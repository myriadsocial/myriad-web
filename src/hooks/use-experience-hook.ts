import {useDispatch} from 'react-redux';

import {
  searchExperience,
  searchPeople,
  searchTags,
  cloneExperience,
  fetchExperience,
} from 'src/reducers/experience/actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useExperienceHook = () => {
  const dispatch = useDispatch();

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
  };
};
