import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/client';

import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';

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
    subtitle: {
      textTransform: 'uppercase',
      fontSize: 12
    },
    gutters: {
      border: `1px solid`,
      borderColor: '#A942E9',
      borderRadius: 8,
      marginBottom: theme.spacing(1)
    },
    icon: {
      minWidth: 40
    },
    showText: {
      width: '100%',
      padding: '2px',
      fontWeight: 600
    },
    balanceText: {
      width: '100%',
      padding: '2px',
      fontWeight: 700
    },
    container: {
      width: '100%',
      backgroundColor: 'transparent',
      position: 'relative',
      margin: '0 4px'
    },
    spinner: {
      color: '#A942E9'
    }
  })
);

export const BalanceComponent = React.memo(function Wallet() {
  const style = useStyles();
  const [session] = useSession();
  const [isHidden, setIsHidden] = useState(true);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBalanceForComponent();
  }, [balance]);

  const getBalanceForComponent = async () => {
    setLoading(true);
    const currentAddress = session?.user.address;
    const freeBalance = await getBalance(currentAddress);
    if (freeBalance) {
      setBalance(Number((freeBalance / 100).toFixed(3)));
      setLoading(false);
    }
  };

  const handleIsHidden = () => {
    setIsHidden(!isHidden);
  };

  const handleClick = () => {
    getBalanceForComponent();
  };

  return (
    <div className={style.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography className={style.title} variant="h5">
            Total Balance
          </Typography>
        </Grid>
        <Grid item>
          <List>
            <ListItem button className={style.gutters}>
              <ListItemIcon className={style.icon}>
                <RefreshIcon onClick={handleClick} />
              </ListItemIcon>
              <Divider orientation="vertical" flexItem />
              <div className={style.container}>
                <ListItemText>
                  {isHidden ? (
                    <Typography className={style.showText} onClick={handleIsHidden}>
                      Show balance
                    </Typography>
                  ) : loading ? (
                    <CircularProgress className={style.spinner} size={20} />
                  ) : (
                    <Typography className={style.balanceText} onClick={handleIsHidden}>
                      {balance} <span className={style.subtitle}>Myria</span>
                    </Typography>
                  )}
                </ListItemText>
              </div>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
});
