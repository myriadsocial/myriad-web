import React, { useState } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { Experience } from 'src/interfaces/experience';

type Props = {
  experience: string;
  selectedExperience: string;
};

export default SelectExperienceComponent = ({ experience, handleExperienceChange, handleExperienceClose, handleExperienceOpen }: Props) => {
  const [selectedExperience, setSelectedExperience] = useState('');

  return (
    <>
      <MenuItem value={`${experience.name}`}>{experience.name}</MenuItem>
    </>
  );
};
