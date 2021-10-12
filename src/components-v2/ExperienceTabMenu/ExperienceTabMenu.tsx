import React from 'react';

import Typography from '@material-ui/core/Typography';

import {Experience, UserExperience} from '../../interfaces/experience';
import {TimelineType} from '../../interfaces/timeline';
import {User} from '../../interfaces/user';
import {ExperienceList} from '../ExperienceList/';
import {HeaderWithAction} from '../HeaderWithAction/';

interface ExperienceTabMenuProps {
  experiences: UserExperience[];
  user?: User;
  filterTimeline: (type: TimelineType, experience: Experience) => void;
  filterExperience: (sort: string) => void;
}

export const ExperienceTabMenu: React.FC<ExperienceTabMenuProps> = props => {
  const {experiences, user, filterTimeline, filterExperience} = props;

  return (
    <>
      <Typography variant={'h4'}>Experience</Typography>
      <HeaderWithAction filter={filterExperience} actionText={'+ Create experience'} />
      <ExperienceList filterTimeline={filterTimeline} experiences={experiences} user={user} />
    </>
  );
};
