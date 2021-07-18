import React, { useEffect, useImperativeHandle } from 'react';

import { useSession } from 'next-auth/client';
import dynamic from 'next/dynamic';

import Button from '@material-ui/core/Button';
import SortIcon from '@material-ui/icons/Sort';

import { useTransaction } from '../../../tippingJar/use-transaction.hooks';
import { ActionTabsComponent } from '../tipping/actionTabs.component';
import { TokenDetailComponent } from '../tipping/tokenDetail.component';
import { EmptyTransactionComponent } from './EmptyTransaction.component';
import { ErrorTransactionComponent } from './ErrorTransaction.component';
import { LoadingTransactionComponent } from './LoadingTransaction.component';
import { useStyles } from './transaction.style';

import { useUser } from 'src/context/user.context';
import { useToken } from 'src/hooks/use-token.hook';
import { Token } from 'src/interfaces/token';

const TransactionListComponent = dynamic(() => import('./transactionList.component'));

interface TransactionProps {
  forwardedRef: React.ForwardedRef<any>;
  detailed?: boolean;
}

type StyledComponentProps = {
  className?: string;
  tokens: Token[];
};

type TippingJarComponentProps = {
  detailed?: boolean;
};

const TransactionComponent: React.FC<TransactionProps> = ({ forwardedRef, detailed }) => {
  const styles = useStyles();

  const [session] = useSession();
  const {
    state: { user }
  } = useUser();
  const userAddress = session?.user.address as string;
  const { loading, error, transactions, inboundTxs, outboundTxs, loadInitTransaction } = useTransaction(userAddress);
  const { loadAllUserTokens, userTokens } = useToken(userAddress);

  useEffect(() => {
    loadInitTransaction();
    loadAllUserTokens();
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      loadInitTransaction();
    }
  }));

  if (!user) return null;

  const TippingJarComponent = ({ detailed }: TippingJarComponentProps) => {
    return (
      <div className={detailed ? '' : styles.rootPanel}>
        {detailed === true ? (
          <ActionTabsComponent transactions={transactions} inboundTxs={inboundTxs} outboundTxs={outboundTxs} user={user} />
        ) : (
          <ActionButtonComponent tokens={userTokens} className={styles.panelButtons} />
        )}
      </div>
    );
  };

  const ActionButtonComponent = ({ className, tokens }: StyledComponentProps) => {
    //TODO: token name still hardcoded, will be fixed on next PR
    return (
      <div className={className}>
        <Button variant="contained" color="primary" size="medium" className={styles.iconButton} endIcon={<SortIcon />}>
          Filter by
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          {tokens[0].token_name}
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          {tokens[1].token_name}
        </Button>
      </div>
    );
  };

  return (
    <div ref={forwardedRef}>
      {detailed === true ? <TokenDetailComponent tokens={userTokens} /> : ''}
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
