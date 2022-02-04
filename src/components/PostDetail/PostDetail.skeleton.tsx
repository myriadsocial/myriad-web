import * as React from 'react';

import {Grid} from '@material-ui/core';
import BaseSekeleton from '@material-ui/lab/Skeleton';

import {useStyles} from './PostDetail.styles';

export const Skeleton = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Grid
        container
        direction="row"
        style={{paddingTop: 16, paddingBottom: 16}}
        alignItems="center">
        <BaseSekeleton variant="circle" width={48} height={48} />

        <Grid
          item
          container
          direction="column"
          style={{marginLeft: 20, width: 'calc(100% - 68px)'}}>
          <BaseSekeleton variant="text" width={240} height={24} />
          <BaseSekeleton variant="text" width={100} height={16} />
        </Grid>
      </Grid>

      <BaseSekeleton variant="rect" width="100%" height={300} />
    </div>
  );
};
