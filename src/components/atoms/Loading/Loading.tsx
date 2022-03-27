import React from 'react';

import {Grid} from '@material-ui/core';

import BounceLoader from 'react-spinners/BounceLoader';

type LoadingProps = {
  width?: number;
  height?: number;
};
const color = '#7342CC';

export const Loading: React.FC<LoadingProps> = props => {
  const {width = 40} = props;

  return (
    <Grid container justifyContent="center">
      <BounceLoader color={color} loading={true} size={width} />
    </Grid>
  );
};
