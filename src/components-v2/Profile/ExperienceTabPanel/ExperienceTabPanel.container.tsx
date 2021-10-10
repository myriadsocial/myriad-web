import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components-v2/Timeline/default';
import {Experience, UserExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileExperience} from 'src/reducers/profile/actions';

type ExperienceTabPanelContainerProps = {
  type?: ExperienceType;
  user?: User;
};

export const ExperienceTabPanelContainer: React.FC<ExperienceTabPanelContainerProps> = props => {
  const {user} = props;

  const dispatch = useDispatch();

  const experiences = useSelector<RootState, UserExperience[]>(
    state => state.profileState.experience.data,
  );

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  const handleFilterType = (type: ExperienceType) => {
    dispatch(fetchProfileExperience(type));
  };

  const handleFilterTimeline = (type: TimelineType, experience: Experience) => {
    // code
  };

  return (
    <ExperienceTabPanel
      experiences={experiences}
      onFilter={handleFilterType}
      onSelect={handleFilterTimeline}
    />
  );
};
