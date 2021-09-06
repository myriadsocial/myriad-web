import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);
type Props = {
  open: boolean;
  children: React.ReactNode;
};

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
