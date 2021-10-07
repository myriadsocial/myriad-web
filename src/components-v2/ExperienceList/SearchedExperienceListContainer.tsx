import React from 'react';

import {useRouter} from 'next/router';

import {NonSelectableExperienceList} from '.';
import {useExperienceHook} from '../../hooks/use-experience-hook';

export const SearchedExperienceListContainer: React.FC = () => {
  const {searchedExperiences, subscribeExperience} = useExperienceHook();
  const router = useRouter();

  const handleSubsibeExperience = (experienceId: string) => {
    subscribeExperience(experienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/clone`);
  };

  const handlePreviewExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/preview`);
  };

  return (
    <NonSelectableExperienceList
      experiences={searchedExperiences}
      onSubscribe={handleSubsibeExperience}
      onFollow={handleCloneExperience}
      onPreview={handlePreviewExperience}
    />
  );
};
