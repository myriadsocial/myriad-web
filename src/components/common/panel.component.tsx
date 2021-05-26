import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

type Props = {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactElement;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      backgroundColor: theme.palette.primary.light
    },
    title: {
      flexGrow: 1
    },
    toolbar: {
      padding: '0 12px'
    }
  })
);

export default function Panel({ children, title, actions }: Props) {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <AppBar variant="outlined" position="static" color="primary">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>

          {actions && <>{actions}</>}
        </Toolbar>
      </AppBar>

      {children}
    </Grid>
  );
}
