import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';

import {Props} from './backdrop.interface';
import {useStyles} from './backdrop.style';

export const BackdropComponent: React.FC<Props> = props => {
  const {open, children} = props;
  const style = useStyles();
  return (
    <div>
      <Backdrop className={style.backdrop} open={open}>
        {children}
      </Backdrop>
    </div>
  );
};
