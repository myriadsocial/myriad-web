import React, {useState} from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

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
      <List component="nav" aria-label="experience tab menu">
        {experiences.map(({name, user}) => (
          <ListItem key={`list-item-title`}>
            <SimpleCard
              onClick={handleClick}
              title={name}
              creator={user.name}
              imgUrl={user.profilePictureURL || ''}
              isSelectable={isOnHomePage}
              onClick={handleClick}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ExperienceList;
