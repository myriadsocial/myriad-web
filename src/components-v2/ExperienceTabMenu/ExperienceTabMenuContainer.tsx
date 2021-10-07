import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {useQueryParams} from '../../hooks/use-query-params.hooks';
import {TimelineType} from '../../interfaces/timeline';
import {ExperienceTabMenu} from './ExperienceTabMenu';

import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ExperienceTabMenuContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {push} = useQueryParams();
  // Only load experiences specific to logged user
  const {loadExperience, experiences} = useExperienceHook();

  useEffect(() => {
    //TODO: move this to app level to avoid refetching
    loadExperience();
  }, []);

  const handleFilterTimeline = (type: TimelineType) => {
    push('type', type);
  };

  return (
    <ExperienceTabMenu
      filterTimeline={handleFilterTimeline}
      experiences={experiences}
      user={user}
    />
  );
};
