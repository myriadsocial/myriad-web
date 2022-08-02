import * as React from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import BaseSekeleton from '@material-ui/lab/Skeleton';

export const Skeleton = () => {
  return (
    <Card style={{padding: 20, borderRadius: 10, marginBottom: 30, width: '100%'}}>
      <Grid container direction="row" style={{width: '100%'}} alignItems="center">
        <BaseSekeleton variant="rect" width={68} height={68} />

        <Grid
          item
          container
          direction="column"
          style={{marginLeft: 20, width: 'calc(100% - 88px)'}}>
          <BaseSekeleton variant="text" width={'100%'} height={24} />
          <BaseSekeleton variant="text" width={'50%'} height={16} />
        </Grid>
      </Grid>
    </Card>
  );
};
