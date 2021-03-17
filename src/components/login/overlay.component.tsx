import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    backgroundColor: fade('#FFF', 0.4),
    width: 320,
    left: 0,
    top: 0,
    display: 'flex',
    textAlign: 'center'
  },
  button: {
    padding: '4px 12px'
  },
  title: {
    fontSize: 12,
    color: '#FFF'
  }
});

type Props = {
  toggleLogin: (open) => void;
};

export default function Overlay({ toggleLogin }: Props) {
  const classes = useStyles();

  return (
    <Grid>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            You need to log-in or register before you can link your social media
          </Typography>
          <Button className={classes.button} onClick={() => toggleLogin(true)} size="small" variant="contained" color="secondary">
            Login or Register Now
          </Button>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            You can remain anonymous but will be able comment and send Myria tokens to other users
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
