import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { useMyriadAccount } from './wallet.context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#424242',
      marginBottom: theme.spacing(2),
      color: '#E0E0E0'
    },
    title: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontSize: 24
    },
    titleHidden: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontSize: 24,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10
    },
    subtitle: {
      textTransform: 'uppercase',
      fontSize: 12
    }
  })
);

export const BalanceComponent = React.memo(function Wallet() {
  const style = useStyles();
  const [isHidden, setIsHidden] = useState(true);
  const { state: myriadAccount } = useMyriadAccount();

  const handleIsHidden = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className={style.root}>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <Typography className={style.title} variant="h5">
            Total Balance
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={style.title} variant="h5" onClick={handleIsHidden}>
            {isHidden ? '... ' : myriadAccount.freeBalance.toFixed(3)}
            <span className={style.subtitle}>Myria</span>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
});
