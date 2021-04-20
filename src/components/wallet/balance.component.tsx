import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/client';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { getBalance } from '../../helpers/polkadotApi';

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
    },
    buttonText: {
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      fontSize: 12
    }
  })
);

export const BalanceComponent = React.memo(function Wallet() {
  const style = useStyles();
  const [session] = useSession();
  const [isHidden, setIsHidden] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getBalanceForComponent();
  }, [balance]);

  const getBalanceForComponent = async () => {
    const currentAddress = session?.user.address;
    const freeBalance = await getBalance(currentAddress);
    //console.log('the freeBalance is: ', Number(freeBalance) / 100);
    setBalance(Number((freeBalance / 100).toFixed(3)));
  };

  const handleIsHidden = () => {
    setIsHidden(!isHidden);
  };

  const handleClick = () => {
    getBalanceForComponent();
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
            {isHidden ? '... ' : balance}
            <span className={style.subtitle}>Myria</span>
          </Typography>
        </Grid>
        <Grid item>
          <Button className={style.buttonText} onClick={handleClick}>
            Refresh
          </Button>
        </Grid>
      </Grid>
    </div>
  );
});
