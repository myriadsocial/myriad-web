import React, {useState, useEffect} from 'react';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles, withStyles} from '@material-ui/core/styles';

import {format} from 'date-fns';
import {Transaction} from 'src/interfaces/transaction';
import {User} from 'src/interfaces/user';

type Props = {
  transactions: Transaction[];
  user: User;
  sortType?: string;
  sortDirection?: string;
};

type ListItemContentProps = {
  txHistory: Transaction;
  userId: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxHeight: 300,
      overflow: 'auto',
    },
    expandButton: {
      justifyContent: 'center',
    },
  }),
);

const useStylesListItemContent = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      textAlign: 'right',
      '& > *': {
        margin: '4px 2px',
        textAlign: 'right',
        height: theme.spacing(2),
        textTransform: 'uppercase',
      },
    },
    green: {
      color: '#4caf50',
    },
    red: {
      color: '#b9210d',
    },
  }),
);

const StyledAvatar = withStyles({
  root: {
    width: 56,
    height: 56,
  },
})(Avatar);

const StyledListItemAvatar = withStyles({
  root: {
    minWidth: 56,
    minHeight: 56,
    margin: '0 12px',
  },
})(ListItemAvatar);

const StyledListItemText = withStyles({
  primary: {
    color: '#4b4851',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondary: {
    color: '#9e9e9e',
    fontWeight: 'normal',
    fontSize: 14,
  },
})(ListItemText);

const ListItemContent = ({txHistory, userId}: ListItemContentProps) => {
  const style = useStylesListItemContent();

  const defaultUserName = 'Unknown Myrian';

  if (!txHistory) return null;

  const RenderPrimaryText = (txHistory: Transaction) => {
    return (
      <>
        {userId === txHistory.from ? (
          <>
            You tipped{' '}
            <Link href={`/${direction(txHistory)}`}>
              <a href={`/${direction(txHistory)}`}>{txHistory.toUser?.name ?? defaultUserName}</a>
            </Link>{' '}
            with {txHistory.currencyId}
          </>
        ) : (
          <>
            <Link href={`/${direction(txHistory)}`}>
              <a href={`/${direction(txHistory)}`}>{txHistory.fromUser?.name ?? defaultUserName}</a>
            </Link>{' '}
            tipped you {txHistory.currencyId}
          </>
        )}
      </>
    );
  };

  const RenderSecondaryText = (txHistory: Transaction) => {
    const formatDate = () => {
      return format(new Date(txHistory.createdAt), 'E, d MMM yyyy p');
    };

    return <>{formatDate()}</>;
  };

  const direction = (history: Transaction) => {
    if (userId === history.fromUser?.id) return history.toUser?.id;
    else return history.fromUser?.id;
  };

  return (
    <div key={txHistory.id}>
      <ListItem>
        <StyledListItemAvatar>
          <Link href={`/${direction(txHistory)}`}>
            <a href={`/${direction(txHistory)}`}>
              <StyledAvatar
                aria-label="avatar"
                src={
                  txHistory.toUser?.id === userId
                    ? txHistory.fromUser?.profilePictureURL
                    : txHistory.toUser?.profilePictureURL
                }
              />
            </a>
          </Link>
        </StyledListItemAvatar>
        <StyledListItemText
          primary={RenderPrimaryText(txHistory)}
          secondary={RenderSecondaryText(txHistory)}
        />
        <ListItemSecondaryAction>
          <div className={style.badge}>
            <Typography className={userId === txHistory.from ? style.red : style.green}>
              {userId === txHistory.from ? '-' : '+'} {txHistory.amount}
            </Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
};

const TransactionListComponent: React.FC<Props> = ({transactions, user}) => {
  const style = useStyles();

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const userId = user?.id as string;

  useEffect(() => {
    setAllTransactions(transactions);
  }, []);

  if (transactions.length === 0) return null;

  return (
    <>
      <List className={style.root}>
        {allTransactions.map(txHistory => (
          <ListItemContent key={txHistory.hash} txHistory={txHistory} userId={userId} />
        ))}
      </List>
    </>
  );
};

export default TransactionListComponent;
