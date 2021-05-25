import React, { createRef } from 'react';

import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';

import Divider from '../common/divider.component';
import ExpandablePanel from '../common/panel-expandable.component';
import { TippingJarComponent } from '../tippingJar/TippingJar.component';
import { BalanceComponent } from './balance.component';
import { TransactionComponent } from './transaction.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%'
    },
    button: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white,
      borderRadius: 15
    },
    walletActions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(0.25)
    }
  })
);

export const Wallet = React.memo(function Wallet() {
  const style = useStyles();

  const transactionRef = createRef<any>();

  const balanceRef = createRef<any>();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    transactionRef.current?.triggerRefresh();
    balanceRef.current?.triggerRefresh();
  };

  const WalletAction = () => {
    return (
      <div className={style.walletActions}>
        <IconButton
          color="default"
          size="small"
          aria-label="refresh-wallet"
          onClick={handleClick}
          onFocus={event => event.stopPropagation()}>
          <RefreshIcon />
        </IconButton>
        <IconButton
          color="default"
          size="small"
          aria-label="wallet-settings"
          onClick={event => event.stopPropagation()}
          onFocus={event => event.stopPropagation()}>
          <SettingsIcon />
        </IconButton>
      </div>
    );
  };

  return (
    <>
      <ExpandablePanel title="My Wallet" actions={<WalletAction />}>
        <BalanceComponent ref={balanceRef} />
        <Divider />
        <TransactionComponent ref={transactionRef} />
      </ExpandablePanel>
    </>
  );
});
