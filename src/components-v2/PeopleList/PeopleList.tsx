import React from 'react';

import {List} from '@material-ui/core';

import {SearchablePeople} from '../../interfaces/people';
import {PeopleListItem} from '../PeopleList/PeopleListItem';

type PeopleListProps = {
  people: SearchablePeople[];
};

export const PeopleList: React.FC<PeopleListProps> = ({people}) => {
  return (
    <List>
      {people.length &&
        people.map(person => (
          <PeopleListItem
            title={person.name}
            key={person.id}
            avatar={person.profilePictureURL}
            url={`/profile/${person.userSocialMedia.userId}`}
          />
        ))}
    </List>
  );
};
