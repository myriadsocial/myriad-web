import React, {useEffect} from 'react';

import {RightMenuBar} from '.';
import {useExperienceHook} from '../../hooks/use-experience-hook';

export const RightMenuBarContainer: React.FC = () => {
  // Only load experiences specific to logged user
  const {loadExperience, experiences} = useExperienceHook();

  useEffect(() => {
    //TODO: move this to app level to avoid refetching
    loadExperience();
  }, []);

  return <RightMenuBar experiences={experiences} />;
};
