import React from 'react';

import {ExperienceDummy} from '../../ExperienceList/';
import {ExperienceList} from '../../ExperienceList/';

type ExperienceTabPanelProps = {
  experiences: ExperienceDummy[];
  isOnHomePage?: boolean;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, isOnHomePage} = props;

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <ExperienceList isOnHomePage={isOnHomePage} experiences={experiences} />
    </div>
  );
};
