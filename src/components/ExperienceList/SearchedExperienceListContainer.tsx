import React from 'react';

import {useRouter} from 'next/router';

import {SearchedExperienceList} from '.';
import {useExperienceHook} from '../../hooks/use-experience-hook';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';

export const SearchedExperienceListContainer: React.FC = () => {
  const {
    searchedExperiences,
    subscribeExperience,
    unsubscribeExperience,
    experiences: userExperience,
  } = useExperienceHook();
  const {openToasterSnack} = useToasterSnackHook();
  const router = useRouter();

  const handleSubsibeExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId);
    }
  };

  const handleUnsubscribeExperience = (experienceId: string) => {
    unsubscribeExperience(experienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handlePreviewExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/preview`);
  };

  return (
    <SearchedExperienceList
      experiences={searchedExperiences}
      userExperience={userExperience}
      onSubscribe={handleSubsibeExperience}
      onUnsubscribe={handleUnsubscribeExperience}
      onFollow={handleCloneExperience}
      onPreview={handlePreviewExperience}
    />
  );
};
