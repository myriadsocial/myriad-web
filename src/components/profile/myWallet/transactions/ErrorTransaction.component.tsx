import React from 'react';

import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

export const ErrorTransactionComponent = () => {
  return (
    <ListItem>
      <Grid container justify="center">
        <Typography>Error, please try again later!</Typography>
      </Grid>
    </ListItem>
  );
};
