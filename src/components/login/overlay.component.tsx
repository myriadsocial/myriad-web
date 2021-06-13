import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade } from '@material-ui/core/styles';

import { CreateAccountComponent } from 'src/components/login/create-account.component';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    backgroundColor: fade('#FFF', 0.5),
    width: '100%',
    left: 0,
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },

  button: {
    padding: '4px 12px'
  }
});

type OverlayProps = {};

export default function Overlay(props: OverlayProps) {
  const style = useStyles();

  return (
    <Grid>
      <Card className={style.root}>
        <CardContent>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Please register or login first
          </Typography>
          <CreateAccountComponent />
          <Typography variant="body1" gutterBottom>
            Once you're logged in, you can interact with other Myriad users and send them some tips!
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
