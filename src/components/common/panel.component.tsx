import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

type Props = {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactElement;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // width: '100%',
      backgroundColor: theme.palette.primary.light
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

export default function Panel({ children, title, actions }: Props) {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <AppBar variant="outlined" position="static" color="primary">
        <Toolbar>
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
