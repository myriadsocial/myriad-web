import React from 'react';

import Divider from '@material-ui/core/Divider';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      // height: theme.spacing(0.5)
    },
  }),
);

const DividerComponent = () => {
  const style = useStyles();

  return <Divider variant="fullWidth" className={style.root} />;
};

export default DividerComponent;
