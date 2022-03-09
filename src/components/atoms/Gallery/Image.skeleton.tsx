import React from 'react';

import {Skeleton as BaseSekeleton} from '@material-ui/lab';

import {MyriadGreyIcon} from '../Icons';

type SkeletonProps = {
  height: number;
  width: number;
};

export const Skeleton: React.FC<SkeletonProps> = props => {
  return (
    <BaseSekeleton
      variant="rect"
      animation={false}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...props}>
      <MyriadGreyIcon width={50} height={50} />
    </BaseSekeleton>
  );
};
