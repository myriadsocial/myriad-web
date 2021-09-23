import React, {useState} from 'react';

import {ExperienceListProps, useStyles} from '.';
import {SimpleCard} from '../atoms/simple-card/';

const ExperienceList = ({experiences, isOnHomePage = false}: ExperienceListProps): JSX.Element => {
  const classes = useStyles();
  const [selected, setSelected] = useState(false);

  //TODO: still unable to only select one experience card
  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <div className={classes.root}>
      {experiences.map(({name, user}) => (
        <div key={`list-item-title`}>
          <SimpleCard
            onClick={handleClick}
            title={name}
            creator={user.name}
            imgUrl={user.profilePictureURL || ''}
            isSelectable={isOnHomePage}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
