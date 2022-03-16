import React from 'react';

import {Grid, Paper} from '@material-ui/core';

import ReactPlayer from 'react-player/lazy';

type VideoProps = {
  url: string;
  width?: number;
  height?: number;
};

export const Video: React.FC<VideoProps> = props => {
  return (
    <Grid container wrap="wrap" justifyContent="space-around" component={Paper}>
      <ReactPlayer controls={true} playing={false} stopOnUnmount={true} {...props} />
    </Grid>
  );
};
