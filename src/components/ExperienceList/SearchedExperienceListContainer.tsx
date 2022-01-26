import React from 'react';

import {useRouter} from 'next/router';

import {SearchedExperienceList} from '.';
import {useExperienceHook} from '../../hooks/use-experience-hook';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';

type SearchedExperienceListContainerProps = {
  query: string;
};

export const SearchedExperienceListContainer: React.FC<SearchedExperienceListContainerProps> =
  props => {
    const {query} = props;

    const {
      page,
      searchedExperiences,
      experiences: userExperience,
      hasMore,
      searchExperience,
      subscribeExperience,
      unsubscribeExperience,
    } = useExperienceHook();
    const {openToasterSnack} = useToasterSnackHook();
    const router = useRouter();

    const handleLoadNextPage = () => {
      searchExperience(query, page + 1);
    };

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
        loadNextPage={handleLoadNextPage}
        hasMore={hasMore}
        experiences={searchedExperiences}
        userExperience={userExperience}
        onSubscribe={handleSubsibeExperience}
        onUnsubscribe={handleUnsubscribeExperience}
        onFollow={handleCloneExperience}
        onPreview={handlePreviewExperience}
      />
    );
  };
