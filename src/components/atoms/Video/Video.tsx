import React from 'react';

import {Grid, Paper} from '@material-ui/core';

import ReactPlayer from 'react-player/lazy';

type VideoProps = {
  url: string;
};

export const Video: React.FC<VideoProps> = ({url}) => {
  return (
    <Grid
      container
      wrap="wrap"
      justifyContent="space-around"
      component={Paper}
      style={{marginTop: 12}}>
      <ReactPlayer url={url} controls={true} playing={false} stopOnUnmount={true} />
    </Grid>
  );
};
