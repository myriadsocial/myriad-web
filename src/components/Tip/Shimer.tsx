import React from 'react';

import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

export const ShimerComponent: React.FC = () => {
  return (
    <>
      <Grid
        container
        direction="row"
        style={{width: '100%', marginBottom: '24px'}}
        alignItems="center"
        justifyContent="space-between">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
          }}>
          <Skeleton variant="circle" width={24} height={24} />
          <Skeleton variant="text" width={80} height={16} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
          <Skeleton variant="text" width={57} height={16} />
        </div>
      </Grid>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rect" width={'100%'} height={159} style={{borderRadius: 20}} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rect" width={'100%'} height={159} style={{borderRadius: 20}} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rect" width={'100%'} height={159} style={{borderRadius: 20}} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rect" width={'100%'} height={159} style={{borderRadius: 20}} />
        </Grid>
      </Grid>
    </>
  );
};
