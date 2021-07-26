import React, {createRef, forwardRef} from 'react';

import dynamic from 'next/dynamic';

import Divider from '@material-ui/core/Divider';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

const BalanceComponent = dynamic(() => import('../balance/balance.component'));
const TransactionComponent = dynamic(() => import('../transactions/transaction.component'));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      backgroundColor: 'white',
      borderRadius: 8,
      paddingLeft: 21,
      paddingTop: 27,
      paddingRight: 21,
      maxWidth: 678,
      maxHeight: 797,
    },
    button: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white,
      borderRadius: 15,
    },
    walletActions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(0.25),
    },
  }),
);

type BalanceProps = {
  hidden?: boolean;
};

const ForwardedBalanceComponent = forwardRef(({hidden, ...props}: BalanceProps, ref) => (
  <BalanceComponent {...props} hidden={hidden} forwardedRef={ref} />
));

const ForwardedTransactionComponent = forwardRef((props, ref) => (
  <TransactionComponent {...props} forwardedRef={ref} />
));

export const WalletComponent = React.memo(function Wallet() {
  const style = useStyles();

  const transactionRef = createRef<any>();

  const balanceRef = createRef<any>();

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
