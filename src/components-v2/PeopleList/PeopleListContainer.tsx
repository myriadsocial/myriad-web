import React from 'react';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {PeopleList} from './PeopleList';

export const PeopleListContainer: React.FC = () => {
  const {people} = useExperienceHook();

  console.log({people});

  if (!people.length) return <p>loading</p>;

  return <PeopleList people={people} />;
};
