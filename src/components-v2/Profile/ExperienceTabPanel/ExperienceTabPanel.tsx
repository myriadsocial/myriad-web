import React from 'react';

import {UserExperience} from '../../../interfaces/experience';
import {NonSelectableExperienceList} from '../../ExperienceList';
import {experienceFilterOptions, ExperienceType} from '../../Timeline/default';
import {FilterDropdownMenu} from '../../atoms/FilterDropdownMenu';

type ExperienceTabPanelProps = {
  experiences: UserExperience[];
  onFilter: (type: ExperienceType) => void;
  onSubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, onSubscribe, onFollow, onPreview, onFilter} = props;

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

      <NonSelectableExperienceList
        experiences={experiences}
        onSubscribe={onSubscribe}
        onFollow={onFollow}
        onPreview={onPreview}
      />
    </>
  );
};
