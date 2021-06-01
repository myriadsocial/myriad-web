import React, { useEffect, useImperativeHandle } from 'react';

import { useSession } from 'next-auth/client';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';

import { useTransaction } from '../tippingJar/use-transaction.hooks';
import TransactionListComponent from './transactionList.component';

import { useUser } from 'src/components/user/user.context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textSecondary: {
      color: '#E0E0E0'
    },
    action: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white
    },
    badge: {
      textAlign: 'right',
      '& > *': {
        margin: '4px 2px',
        textAlign: 'right',
        height: theme.spacing(2),
        textTransform: 'uppercase'
      }
    },
    avatar: {
      minWidth: 40
    },
    green: {
      backgroundColor: '#4caf50',
      color: '#FFF'
    },
    red: {
      backgroundColor: '#f44336',
      color: '#FFF'
    },
    loading: {
      color: '#A942E9'
    },
    rootPanel: {
      paddingTop: 24,
      paddingBottom: 2
    },
    panelHeader: {
      paddingLeft: 16,
      paddingRight: 16,
      marginBottom: 8
    },
    panelButtons: {
      paddingLeft: 4,
      paddingRight: 4,
      marginBottom: 2
    },
    iconButton: {
      margin: theme.spacing(1)
    }
  })
);

type StyledComponentProps = {
  className?: string;
};

interface TransactionProps {
  forwardedRef: React.ForwardedRef<any>;
}

const TransactionComponent: React.FC<TransactionProps> = ({ forwardedRef }) => {
  const styles = useStyles();

  const [session] = useSession();
  const {
    state: { user }
  } = useUser();
  const userAddress = session?.user.address as string;
  const { loading, error, transactions, loadInitTransaction } = useTransaction(userAddress);

  useEffect(() => {
    loadInitTransaction();
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      loadInitTransaction();
    }
  }));

  if (!user) return null;

  const TippingJarHeader = () => {
    return (
      <div className={styles.rootPanel}>
        <Typography variant="h4" className={styles.panelHeader}>
          {'My Tipping Jar'}
        </Typography>
        <ActionButtonComponent className={styles.panelButtons} />
      </div>
    );
  };

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={styles.loading} />
      </Grid>
    );
  };

  const ErrorComponent = () => {
    return (
      <Grid container justify="center">
        <Typography>Error, please try again later!</Typography>
      </Grid>
    );
  };

  const ActionButtonComponent = ({ className }: StyledComponentProps) => {
    return (
      <div className={className}>
        <Button variant="contained" color="primary" size="medium" className={styles.iconButton} startIcon={<SortIcon />}>
          Sort by
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          Amount
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          Date
        </Button>
      </div>
    );
  };

  const EmptyTransactionComponent = () => {
    return (
      <Grid container justify="center">
        <Typography>Data not available</Typography>
      </Grid>
    );
  };

  return (
    <div ref={forwardedRef}>
      <TippingJarHeader />
      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent />
      ) : transactions.length === 0 ? (
        <EmptyTransactionComponent />
      ) : (
        <TransactionListComponent transactions={transactions} user={user} />
      )}
    </div>
  );
};

export default TransactionComponent;
