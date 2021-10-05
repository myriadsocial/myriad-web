import React, {useEffect, useImperativeHandle} from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import Button from '@material-ui/core/Button';
import SortIcon from '@material-ui/icons/Sort';

import ActionTabsComponent from '../tipping/actionTabs.component';
import TokenDetailComponent from '../tipping/tokenDetail.component';
import {EmptyTransactionComponent} from './EmptyTransaction.component';
import {ErrorTransactionComponent} from './ErrorTransaction.component';
import {LoadingTransactionComponent} from './LoadingTransaction.component';
import {useStyles} from './transaction.style';

import {useTransaction} from 'src/hooks/use-transaction.hooks';
import {Currency} from 'src/interfaces/currency';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const TransactionListComponent = dynamic(() => import('./transactionList.component'));

interface TransactionProps {
  forwardedRef: React.ForwardedRef<any>;
  detailed?: boolean;
}

type StyledComponentProps = {
  className?: string;
  tokens: Currency[];
};

type TippingJarComponentProps = {
  detailed?: boolean;
};

const TransactionComponent: React.FC<TransactionProps> = ({forwardedRef, detailed}) => {
  const styles = useStyles();

  const {user, currencies: userTokens} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {loading, error, transactions, inboundTxs, outboundTxs, loadInitTransaction} =
    useTransaction();

  if (!user) return null;

  useEffect(() => {
    loadInitTransaction();
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      loadInitTransaction();
    },
  }));

  if (!user) return null;

  const TippingJarComponent = ({detailed}: TippingJarComponentProps) => {
    return (
      <div className={detailed ? '' : styles.rootPanel}>
        {detailed === true ? (
          <ActionTabsComponent
            transactions={transactions}
            inboundTxs={inboundTxs}
            outboundTxs={outboundTxs}
            user={user}
          />
        ) : (
          <ActionButtonComponent tokens={userTokens} className={styles.panelButtons} />
        )}
      </div>
    );
  };

  const ActionButtonComponent = ({className, tokens}: StyledComponentProps) => {
    //TODO: token name still hardcoded, will be fixed on next PR
    return (
      <div className={className}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className={styles.iconButton}
          endIcon={<SortIcon />}>
          Filter by
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          {tokens[0].id}
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          {tokens[1].id}
        </Button>
      </div>
    );
  };

  return (
    <div ref={forwardedRef}>
      {detailed && <TokenDetailComponent />}
      {loading ? (
        <LoadingTransactionComponent />
      ) : error ? (
        <ErrorTransactionComponent />
      ) : transactions.length === 0 ? (
        <EmptyTransactionComponent />
      ) : detailed === true ? (
        <TippingJarComponent detailed={detailed} />
      ) : (
        <TransactionListComponent transactions={transactions} user={user} />
      )}
    </div>
  );
};

export default TransactionComponent;
