import React, { createRef, useEffect, forwardRef } from 'react';

import dynamic from 'next/dynamic';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';

import ExpandablePanel from '../common/panel-expandable.component';

const BalanceComponent = dynamic(() => import('./balance.component'));

const TransactionComponent = dynamic(() => import('./transactions/transaction.component'));

const WalletSettingComponent = dynamic(() => import('./walletSetting.component'));

const ForwardedBalanceComponent = forwardRef((props, ref) => <BalanceComponent {...props} forwardedRef={ref} />);

const ForwardedTransactionComponent = forwardRef((props, ref) => <TransactionComponent {...props} forwardedRef={ref} />);

const ForwardedWalletSettingComponent = forwardRef((props, ref) => <WalletSettingComponent {...props} forwardedRef={ref} />);

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

  const walletSettingRef = createRef<any>();

  useEffect(() => {}, [transactionRef, balanceRef]);

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    transactionRef.current?.triggerRefresh();
    balanceRef.current?.triggerRefresh();
  };

  const handleWalletSetting = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    walletSettingRef.current?.triggerShowSetting();
  };

  const WalletAction = () => {
    return (
      <div className={style.walletActions}>
        <IconButton
          color="default"
          size="small"
          aria-label="refresh-wallet"
          onClick={handleRefresh}
          onFocus={event => event.stopPropagation()}>
          <RefreshIcon />
        </IconButton>
        <IconButton
          color="default"
          size="small"
          aria-label="wallet-settings"
          onClick={handleWalletSetting}
          onFocus={event => event.stopPropagation()}>
          <SettingsIcon />
        </IconButton>
      </div>
    );
  };

  return (
    <div id="wallet">
      <ExpandablePanel title="My Wallet" actions={<WalletAction />}>
        <ForwardedBalanceComponent ref={balanceRef} />
        <Divider variant="middle" />
        <ForwardedTransactionComponent ref={transactionRef} />
      </ExpandablePanel>

      <ForwardedWalletSettingComponent ref={walletSettingRef} />
    </div>
  );
});
