import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    loading: {
      left: 'calc(50% - 20px)',
      position: 'absolute',
      top: 100,
    },
  }),
);

export const LoadingBasic: React.FC = () => {
  const style = useStyles();

  return (
    <Grid container justify="center">
      <CircularProgress className={style.loading} />
    </Grid>
  );
};
