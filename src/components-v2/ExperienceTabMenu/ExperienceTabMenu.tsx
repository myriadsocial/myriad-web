import React from 'react';

import Typography from '@material-ui/core/Typography';

import {Experience} from '../../interfaces/experience';
import {ExperienceList} from '../ExperienceList/';
import {HeaderWithAction} from '../HeaderWithAction/';

interface ExperienceTabMenuProps {
  experiences: Experience[];
}

export const ExperienceTabMenu: React.FC<ExperienceTabMenuProps> = props => {
  const {experiences} = props;

  return (
    <>
      <Typography variant={'h4'}>Experience</Typography>
      <HeaderWithAction actionText={'+ Create experience'} />
      <ExperienceList experiences={experiences} />
    </>
  );
};
