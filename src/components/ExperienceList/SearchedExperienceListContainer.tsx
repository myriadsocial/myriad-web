import React from 'react';

import {useRouter} from 'next/router';

import {Grid} from '@material-ui/core';

import {SearchedExperienceList} from '.';
import {useExperienceHook} from '../../hooks/use-experience-hook';
import {Skeleton} from '../atoms/SimpleCard/NonSelectableSimpleCard.skeleton';

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
      loading,
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

    if (loading && searchedExperiences.length === 0)
      return (
        <Grid container justify="center">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Grid>
      );

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
