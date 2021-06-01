import React, { createRef, useEffect, forwardRef } from 'react';

import dynamic from 'next/dynamic';

import Divider from '@material-ui/core/Divider';
//import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

//import RefreshIcon from '@material-ui/icons/Refresh';
//import SettingsIcon from '@material-ui/icons/Settings';
const BalanceComponent = dynamic(() => import('./balance.component'));
const TransactionComponent = dynamic(() => import('./transaction.component'));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      backgroundColor: 'white',
      borderRadius: 8,
      paddingLeft: 21,
      paddingTop: 27,
      paddingRight: 55,
      maxWidth: 678,
      maxHeight: 797,
      border: '2px solid red'
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

const ForwardedBalanceComponent = forwardRef((props, ref) => <BalanceComponent {...props} forwardedRef={ref} />);

const ForwardedTransactionComponent = forwardRef((props, ref) => <TransactionComponent {...props} forwardedRef={ref} />);

export const WalletComponent = React.memo(function Wallet() {
  const style = useStyles();

  const transactionRef = createRef<any>();

  const balanceRef = createRef<any>();

  useEffect(() => {}, [transactionRef, balanceRef]);

  //const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //e.stopPropagation();
  //transactionRef.current?.triggerRefresh();
  //balanceRef.current?.triggerRefresh();
  //};

  return (
    <div className={style.root}>
      <ForwardedBalanceComponent ref={balanceRef} />
      <Divider variant="middle" />
      <ForwardedTransactionComponent ref={transactionRef} />
    </div>
  );
});
