import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import {CreateAccountComponent} from 'src/components/login/create-account.component';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    backgroundColor: '#FFF',
    width: '100%',
    left: 0,
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },

  button: {
    padding: '4px 12px',
  },
});

export default function Overlay() {
  const style = useStyles();

  return (
    <Grid>
      <Card className={style.root}>
        <CardContent>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Please sign in first
          </Typography>
          <CreateAccountComponent />
          <Typography variant="body1" gutterBottom>
            Once you're signed in, you can send tips to anyone you like, and not only those on
            Myriad - just import their social media post, tip it, then the owner will collect the
            tip as soon as they've joined Myriad!
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
