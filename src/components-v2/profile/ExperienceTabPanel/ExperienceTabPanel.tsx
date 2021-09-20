import React, {useState} from 'react';

import {ExperienceDummy} from '../../ExperienceList/';
import {ExperienceList} from '../../ExperienceList/';
import {DropdownMenu, MenuOptions} from '../../atoms/DropdownMenu/';

type ExperienceTabPanelProps = {
  experiences: ExperienceDummy[];
  isOnHomePage?: boolean;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, isOnHomePage} = props;

  const [sortExperienceOptions] = useState<MenuOptions[]>([
    {id: 'first-option', title: 'All Experience'},
    {id: 'second-option', title: 'Name'},
  ]);
  const [title] = useState('Sort by');

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <DropdownMenu title={title} options={sortExperienceOptions} />
      <ExperienceList isOnHomePage={isOnHomePage} experiences={experiences} />
    </div>
  );
};
