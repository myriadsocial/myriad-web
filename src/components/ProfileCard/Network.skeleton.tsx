import * as React from 'react';

import {Grid} from '@material-ui/core';
import BaseSekeleton, {SkeletonProps} from '@material-ui/lab/Skeleton';

export const Skeleton: React.FC<SkeletonProps> = props => {
  return (
    <Grid container direction="row" alignItems="center" justifyContent="space-between">
      <BaseSekeleton variant="rect" width={114} height={40} style={{borderRadius: 20}} />

      <BaseSekeleton variant="rect" width={114} height={40} style={{borderRadius: 20}} />
    </Grid>
  );
};
