import * as React from 'react';

import BaseSekeleton, {SkeletonProps} from '@material-ui/lab/Skeleton';

import {MyriadGreyIcon} from '../Icons';

export const Skeleton: React.FC<SkeletonProps> = props => {
  return (
    <BaseSekeleton
      variant="rect"
      animation={false}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '##EDEDED',
      }}
      {...props}>
      <MyriadGreyIcon />
    </BaseSekeleton>
  );
};
