import React from 'react';

import {UserExperience} from '../../../interfaces/experience';
import {NonSelectableExperienceList} from '../../ExperienceList';
import {experienceFilterOptions, ExperienceType} from '../../Timeline/default';
import {FilterDropdownMenu} from '../../atoms/FilterDropdownMenu';

type ExperienceTabPanelProps = {
  experiences: UserExperience[];
  onFilter: (type: ExperienceType) => void;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, onFilter} = props;

  const handleFilterSelected = (selected: string) => {
    onFilter(selected as ExperienceType);
  };

  return (
    <>
      <FilterDropdownMenu
        title="Filter by"
        options={experienceFilterOptions}
        onChange={handleFilterSelected}
      />

      <NonSelectableExperienceList experiences={experiences} />
    </>
  );
};
