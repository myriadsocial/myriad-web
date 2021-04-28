import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/client';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
    gutters: {
      border: `1px solid`,
      borderColor: '#A942E9',
      borderRadius: 8,
      margin: theme.spacing(2),
      padding: 0
    },
    buttonText: {
      height: 24,
      lineHeight: 10,
      textAlign: 'center',
      border: 1,
      borderRadius: 8
    }
  })
);

const typographyProps = { style: { fontSize: 10, padding: '5px 0', fontWeight: 500 } };

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
    if (freeBalance) {
      setBalance(Number((freeBalance / 100).toFixed(3)));
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
      <Grid container direction="row" justify="center" alignItems="center">
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
          <List>
            <ListItem button className={style.gutters} onClick={handleClick}>
              <ListItemText primaryTypographyProps={typographyProps} className={style.buttonText}>
                <Typography>Refresh</Typography>
              </ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
});
