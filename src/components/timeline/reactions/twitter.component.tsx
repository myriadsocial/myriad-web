import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme, lighten } from '@material-ui/core/styles';

import LikeIcon from '../../../images/twitter/like.svg';
import RetweetIcon from '../../../images/twitter/retweet.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2),
      '& > *': {
        margin: 0,
        padding: 0
      }
    },
    wrapper: {
      paddingRight: theme.spacing(2),
      textAlign: 'center'
    },
    icon: {
      height: 20,
      fill: lighten('#AAB8C2', 0.3)
    }
  })
);

export default function TwitterReactionComponent() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton aria-label="retweet" className={classes.wrapper} disableRipple={true} disableFocusRipple={true}>
        <RetweetIcon className={classes.icon} />
        <Typography variant="subtitle1">126</Typography>
      </IconButton>

      <IconButton aria-label="like" className={classes.wrapper} disableRipple disableFocusRipple>
        <LikeIcon className={classes.icon} />
        <Typography variant="subtitle1">12</Typography>
      </IconButton>
    </div>
  );
}
