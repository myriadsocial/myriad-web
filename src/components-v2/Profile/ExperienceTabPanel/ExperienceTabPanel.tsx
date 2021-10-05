import React, {useState} from 'react';

import {Experience} from '../../../interfaces/experience';
import {ExperienceList} from '../../ExperienceList';
import {experienceFilterOptions} from '../../Timeline/default';
import {FilterDropdownMenu} from '../../atoms/FilterDropdownMenu';

type ExperienceTabPanelProps = {
  experiences: Experience[];
  isOnHomePage?: boolean;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, isOnHomePage} = props;

  const [title] = useState('Filter by');

  const handleFilterSelected = (selected: string) => {
    // code
  };

  return (
    <>
      <FilterDropdownMenu
        title={title}
        options={experienceFilterOptions}
        onChange={handleFilterSelected}
      />
      <ExperienceList
        isOnHomePage={isOnHomePage}
        experiences={experiences}
        filterTimeline={console.log}
      />
    </>
  );
};
