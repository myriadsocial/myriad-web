import React, {useState} from 'react';

import {Experience} from '../../../interfaces/experience';
import {ExperienceList} from '../../ExperienceList/';
import {MenuOptions} from '../../atoms/DropdownMenu/';
import {FilterDropdownMenu} from '../../atoms/FilterDropdownMenu/';

type ExperienceTabPanelProps = {
  experiences: Experience[];
  isOnHomePage?: boolean;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, isOnHomePage} = props;

  const [sortExperienceOptions] = useState<MenuOptions[]>([
    {id: 'all', title: 'All Experience'},
    {id: 'personal', title: 'Personal Experience'},
    {id: 'other', title: 'Other Experience'},
  ]);
  const [title] = useState('Filter by');

  return (
    <>
      <FilterDropdownMenu title={title} options={sortExperienceOptions} />
      <ExperienceList isOnHomePage={isOnHomePage} experiences={experiences} />
    </>
  );
};
