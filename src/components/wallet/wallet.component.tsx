import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { BalanceComponent } from './balance.component';
import { TransactionComponent } from './transaction.component';
import Panel from '../common/panel.component';
import Divider from '../common/divider.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white,
      borderRadius: 15
    }
  })
);

export const Wallet = React.memo(function Wallet() {
  const classes = useStyles();

  const WalletAction = (
    <Button variant="contained" className={classes.button}>
      Get Myria Token
    </Button>
  );

  return (
    <Panel title="Wallet" actions={WalletAction}>
      <BalanceComponent />
      <Divider />
      <TransactionComponent />
    </Panel>
  );
});
