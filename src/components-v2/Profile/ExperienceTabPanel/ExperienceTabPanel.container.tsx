import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components-v2/Timeline/default';
import {Experience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {fetchExperience} from 'src/reducers/experience/actions';
import {ExperienceState} from 'src/reducers/experience/reducer';

type ExperienceTabPanelContainerProps = {
  type?: ExperienceType;
};

export const ExperienceTabPanelContainer: React.FC<ExperienceTabPanelContainerProps> = props => {
  const dispatch = useDispatch();

  const {experiences} = useSelector<RootState, ExperienceState>(state => state.experienceState);

  const handleFilterType = (type: ExperienceType) => {
    dispatch(fetchExperience(type));
  };

  const handleFilterTimeline = (type: TimelineType, experience: Experience) => {
    // code
  };

  return (
    <>
      <ExperienceTabPanel
        experiences={experiences}
        onFilter={handleFilterType}
        onSelect={handleFilterTimeline}
      />
    </>
  );
};
