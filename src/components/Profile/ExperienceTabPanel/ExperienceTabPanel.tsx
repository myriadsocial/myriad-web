import React, {useState} from 'react';

import {UserExperience} from '../../../interfaces/experience';
import {NonSelectableExperienceList} from '../../ExperienceList';
import {experienceFilterOptions, ExperienceType} from '../../Timeline/default';
import {FilterDropdownMenu} from '../../atoms/FilterDropdownMenu';

type ExperienceTabPanelProps = {
  experiences: UserExperience[];
  userExperience?: UserExperience[];
  onFilter: (type: ExperienceType) => void;
  onSubscribe?: (experienceId: string) => void;
  onUnsubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
};

export const ExperienceTabPanel: React.FC<ExperienceTabPanelProps> = props => {
  const {experiences, userExperience, onSubscribe, onUnsubscribe, onFollow, onPreview, onFilter} =
    props;

  const [filterTriggered, setFilterTriggered] = useState(false);

  const handleFilterSelected = (selected: string) => {
    onFilter(selected as ExperienceType);
    setFilterTriggered(true);
  };

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <FilterDropdownMenu
          title="Filter by"
          options={experienceFilterOptions}
          onChange={handleFilterSelected}
        />
      </div>

      <NonSelectableExperienceList
        isFilterTriggered={filterTriggered}
        experiences={experiences}
        userExperience={userExperience}
        onSubscribe={onSubscribe}
        onUnsubscribe={onUnsubscribe}
        onFollow={onFollow}
        onPreview={onPreview}
      />
    </>
  );
};
