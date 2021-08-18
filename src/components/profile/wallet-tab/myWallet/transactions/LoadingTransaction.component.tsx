import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';

import {useStyles} from './transaction.style';

export const LoadingTransactionComponent = () => {
  const styles = useStyles();

  return (
    <ListItem>
      <Grid container justify="center">
        <CircularProgress className={styles.loading} />
      </Grid>
    </ListItem>
  );
};
