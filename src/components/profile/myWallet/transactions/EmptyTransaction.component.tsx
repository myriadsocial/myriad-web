import React from 'react';

import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

export const EmptyTransactionComponent = () => {
  return (
    <ListItem>
      <Grid container justify="center">
        <Typography>Data not available</Typography>
      </Grid>
    </ListItem>
  );
};
