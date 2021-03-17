import React from 'react';

import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import AngryIcon from '../../../images/facebook/angry.svg';
import HahaIcon from '../../../images/facebook/haha.svg';
import SadIcon from '../../../images/facebook/sad.svg';
import WowIcon from '../../../images/facebook/wow.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2),
      '& > *': {
        margin: 0,
        padding: 0
      }
    }
  })
);

export default function FacebookReactionComponent() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton aria-label="angry">
        <AngryIcon />
      </IconButton>
      <IconButton aria-label="sad">
        <SadIcon />
      </IconButton>
      <IconButton aria-label="haha">
        <HahaIcon />
      </IconButton>
      <IconButton aria-label="wow">
        <WowIcon />
      </IconButton>
      <IconButton aria-label="wow">
        <Chip variant="outlined" size="small" label="20" />
      </IconButton>
    </div>
  );
}
