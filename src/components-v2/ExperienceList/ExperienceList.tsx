import React, {useState} from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

import {SimpleCard} from '../atoms/simple-card/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
    },
  }),
);

const experiences = [
  {
    title: 'Cryptowatcher',
    creator: 'Lara Schoffield',
    imgUrl:
      'https://gist.githack.com/ical10/8178e2e0d345c691ceffd0b9bdb065a0/raw/e6a2e66955752fa1203667ab80b8dab0b09c9aa6/stonks.svg,',
  },
  {
    title: 'Bitcoin Strategy',
    creator: 'Jenny Chang',
    imgUrl:
      'https://gist.githack.com/ical10/8178e2e0d345c691ceffd0b9bdb065a0/raw/e6a2e66955752fa1203667ab80b8dab0b09c9aa6/stonks.svg',
  },
];

const SimpleList = (): JSX.Element => {
  const classes = useStyles();
  const [selected, setSelected] = useState(false);

  //TODO: still unable to only select one experience card
  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="experience tab menu">
        {experiences.map(({title, creator, imgUrl}) => (
          <ListItem key={`list-item-title`}>
            <SimpleCard onClick={handleClick} title={title} creator={creator} imgUrl={imgUrl} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SimpleList;
