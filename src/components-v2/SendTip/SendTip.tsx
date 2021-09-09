import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 340,
      height: 680,
      background: '#FFFFFF',
      //boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,
    },
    header: {
      paddingTop: 30,
      textAlign: 'center',
    },
  }),
);

export const SendTip = (): JSX.Element => {
  const classes = useStyles();
  const [tipAmount, setTipAmount] = useState(0);

  return (
    <Paper className={classes.root}>
      <Typography className={classes.header} variant="h4">
        Send Tip
      </Typography>
    </Paper>
  );
};
