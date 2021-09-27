import React, {useEffect} from 'react';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {ExperienceTabMenu} from './ExperienceTabMenu';

export const ExperienceTabMenuContainer: React.FC = () => {
  // Only load experiences specific to logged user
  const {loadExperience, experiences} = useExperienceHook();

  useEffect(() => {
    //TODO: move this to app level to avoid refetching
    loadExperience();
  }, []);

  return <ExperienceTabMenu experiences={experiences} />;
};
