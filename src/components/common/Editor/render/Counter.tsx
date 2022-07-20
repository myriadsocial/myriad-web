import React from 'react';

import {Typography} from '@material-ui/core';

type CounterProps = {
  current: number;
  limit: number;
  className: string;
};

export const Counter: React.FC<CounterProps> = props => {
  const {current, limit, className} = props;

  return (
    <Typography variant="body1" component="div" className={className}>
      {current}/{limit}
    </Typography>
  );
};
