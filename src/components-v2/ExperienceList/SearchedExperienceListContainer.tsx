import React from 'react';

import {NonSelectableExperienceList} from '.';
import {useExperienceHook} from '../../hooks/use-experience-hook';

export const SearchedExperienceListContainer: React.FC = () => {
  const {searchedExperiences} = useExperienceHook();

  return <NonSelectableExperienceList experiences={searchedExperiences} />;
};
