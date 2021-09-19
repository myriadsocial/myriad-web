import React from 'react';

import {Experience} from '../../interfaces/experience';
import {ExperienceList} from '../ExperienceList/';
import {HeaderWithAction} from '../HeaderWithAction/';

interface ExperienceTabMenuProps {
  experiences: Experience[];
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
