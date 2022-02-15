import React from 'react';

import {Grid} from '@material-ui/core';

import {Skeleton} from '../Expericence';
import {ExperienceListContainer} from './ExperienceList.container';

import {useExperienceHook} from 'src/hooks/use-experience-hook';

type SearchExperienceListContainerProps = {
  query: string;
};

export const SearchExperienceListContainer: React.FC<SearchExperienceListContainerProps> =
  props => {
    const {query} = props;

    const {page, experiences, hasMore, loading, searchExperience} = useExperienceHook();

    const handleLoadNextPage = () => {
      searchExperience(query, page + 1);
    };

    if (loading && experiences.length === 0)
      return (
        <Grid container justify="center">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Grid>
      );

    return (
      <ExperienceListContainer
        loadNextPage={handleLoadNextPage}
        hasMore={hasMore}
        selectable={false}
        enableClone
        enableSubscribe
      />
    );
  };
