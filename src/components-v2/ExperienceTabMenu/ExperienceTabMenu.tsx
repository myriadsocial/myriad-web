import React from 'react';

import {ExperienceDummy} from '../ExperienceList/';
import {ExperienceList} from '../ExperienceList/';
import {HeaderWithAction} from '../HeaderWithAction/';

interface ExperienceTabMenuProps {
  experiences: ExperienceDummy[];
}

export const ExperienceTabMenu: React.FC<ExperienceTabMenuProps> = props => {
  const {experiences} = props;

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <HeaderWithAction title={'Experience'} actionText={'+ Create new experience'} />
      <ExperienceList experiences={experiences} />
    </div>
  );
};
