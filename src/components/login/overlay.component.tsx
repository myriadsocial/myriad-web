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
  },
  title: {
    fontSize: 12,
    color: '#FFF'
  }
});

type Props = {
  toggleLogin: (open: boolean) => void;
};

export default function Overlay({ toggleLogin }: Props) {
  const style = useStyles();

  return (
    <Grid>
      <Card className={style.root}>
        <CardContent>
          <Typography className={style.title} color="textSecondary" gutterBottom>
            Please register or login first
          </Typography>
          <Button className={style.button} onClick={() => toggleLogin(true)} size="small" variant="contained" color="secondary">
            Login or Register Now
          </Button>
          <Typography className={style.title} color="textSecondary" gutterBottom>
            Once you're logged in, you can interact with other Myriad users and send them some tips!
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
