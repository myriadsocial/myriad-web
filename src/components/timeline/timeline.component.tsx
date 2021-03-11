import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import PostComponent from './post.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      '& > *': {
        margin: theme.spacing(1)
      }
    }
  })
);

export default function Timeline() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PostComponent open={true} />
      <PostComponent />
      <PostComponent />
    </div>
  );
}
