import React, {useState} from 'react';

import {Experience, UserExperience} from '../../../interfaces/experience';
import {ExperienceList} from '../../ExperienceList';
import {experienceFilterOptions} from '../../Timeline/default';
import {FilterDropdownMenu} from '../../atoms/FilterDropdownMenu';

type ExperienceTabPanelProps = {
  experiences: Experience[];
  isOnHomePage?: boolean;
  onFilter: (type: ExperienceType) => void;
  onSelect: (type: TimelineType, experience: Experience) => void;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, isOnHomePage} = props;

  const handleFilterTimeline = (type: TimelineType, experience: Experience) => {
    onSelect(type, experience);
  };

  return (
    <>
      <FilterDropdownMenu title={title} options={experienceFilterOptions} />
      <ExperienceList isOnHomePage={isOnHomePage} experiences={experiences} />
    </>
  );
};
