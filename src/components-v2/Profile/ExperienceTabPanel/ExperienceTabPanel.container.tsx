import React from 'react';
import {useSelector} from 'react-redux';

import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components-v2/Timeline/default';
import {RootState} from 'src/reducers';
import {ExperienceState} from 'src/reducers/experience/reducer';

type ExperienceTabPanelContainerProps = {
  type?: ExperienceType;
};

export const ExperienceTabPanelContainer: React.FC<ExperienceTabPanelContainerProps> = props => {
  const {experiences} = useSelector<RootState, ExperienceState>(state => state.experienceState);

  const handleFilterType = (type: ExperienceType) => {
    // code
  };

  return (
    <>
      <ExperienceTabPanel experiences={experiences} onFilter={handleFilterType} />
    </>
  );
};
