import * as React from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import BaseSekeleton from '@material-ui/lab/Skeleton';

import {useStyles} from '.';

export const Skeleton = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Grid container direction="row" style={{padding: 16, width: '100%'}} alignItems="center">
        <BaseSekeleton variant="rect" width={68} height={68} />

        <Grid
          item
          container
          direction="column"
          style={{marginLeft: 20, width: 'calc(100% - 88px)'}}>
          <BaseSekeleton variant="text" width={240} height={24} />
          <BaseSekeleton variant="text" width={100} height={16} />
        </Grid>
      </Grid>
    </Card>
  );
};
