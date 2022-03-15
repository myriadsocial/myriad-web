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
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="text" width={155} height={16} style={{borderRadius: 10}} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
          <Skeleton variant="text" width={102} height={16} style={{borderRadius: 10}} />
          <Skeleton variant="text" width={52} height={16} style={{borderRadius: 10}} />
        </div>
      </Grid>
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
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="text" width={155} height={16} style={{borderRadius: 10}} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
          <Skeleton variant="text" width={102} height={16} style={{borderRadius: 10}} />
          <Skeleton variant="text" width={52} height={16} style={{borderRadius: 10}} />
        </div>
      </Grid>
      <Grid
        container
        direction="row"
        style={{width: '100%'}}
        alignItems="center"
        justifyContent="space-between">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
          }}>
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="text" width={155} height={16} style={{borderRadius: 10}} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
          <Skeleton variant="text" width={102} height={16} style={{borderRadius: 10}} />
          <Skeleton variant="text" width={52} height={16} style={{borderRadius: 10}} />
        </div>
      </Grid>
    </>
  );
};
