import React from 'react';

import {Experience, UserExperience} from '../../../interfaces/experience';
import {ExperienceList} from '../../ExperienceList';
import {experienceFilterOptions, ExperienceType} from '../../Timeline/default';
import {FilterDropdownMenu} from '../../atoms/FilterDropdownMenu';

import {TimelineType} from 'src/interfaces/timeline';

type ExperienceTabPanelProps = {
  experiences: UserExperience[];
  isOnHomePage?: boolean;
  onFilter: (type: ExperienceType) => void;
  onSelect: (type: TimelineType, experience: Experience) => void;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, isOnHomePage = false, onFilter, onSelect} = props;

  const handleFilterSelected = (selected: string) => {
    onFilter(selected as ExperienceType);
  };

  const handleFilterTimeline = (type: TimelineType, experience: Experience) => {
    onSelect(type, experience);
  };

  return (
    <>
      <FilterDropdownMenu
        title="Filter by"
        options={experienceFilterOptions}
        onChange={handleFilterSelected}
      />

      <ExperienceList
        isOnHomePage={isOnHomePage}
        experiences={experiences}
        filterTimeline={handleFilterTimeline}
      />
    </>
  );
};
