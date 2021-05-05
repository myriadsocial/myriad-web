import React, { useState, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';

import { Transaction } from 'src/interfaces/transaction';

type Props = {
  transactions: Transaction[];
  userId: string;
  sortType?: string;
  sortDirection?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: theme.spacing(2),
      color: '#E0E0E0'
    },
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
    received: {
      color: '#4caf50'
    },
    red: {
      backgroundColor: '#f44336',
      color: '#FFF'
    },
    sent: {
      color: '#f44336'
    },
    loading: {
      color: '#A942E9'
    },
    panel: {
      padding: '4px'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    transactionActionList: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      alignItems: 'flex-start'
    },
    iconButton: {
      color: '#FFF'
    },
    typography: {
      padding: theme.spacing(2)
    }
  })
);

export default function TransactionListComponent({ transactions, userId }: Props) {
  const style = useStyles();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setAllTransactions(transactions);
  }, []);

  const RenderPrimaryText = (txHistory: Transaction) => {
    return (
      <div>
        {userId === txHistory?.from ? (
          <Tooltip title={`${txHistory?.to}`} placement="top" leaveDelay={3000} interactive>
            <Button>To: ...</Button>
          </Tooltip>
        ) : (
          <Tooltip title={`${txHistory?.from}`} placement="top" leaveDelay={3000} interactive>
            <Button>From: ...</Button>
          </Tooltip>
        )}
      </div>
    );
  };

  const RenderSecondaryText = (txHistory: Transaction) => {
    return (
      <Tooltip title={`${txHistory?.trxHash}`} placement="top" leaveDelay={3000} interactive>
        <Button>Tx: ...</Button>
      </Tooltip>
    );
  };

  if (transactions.length === 0) return null;

  return (
    <List className={style.root}>
      {allTransactions.map(txHistory => (
        <ListItem key={txHistory?.id}>
          <ListItemAvatar className={style.avatar}>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            className={style.textSecondary}
            secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
            primary={RenderPrimaryText(txHistory)}
            secondary={RenderSecondaryText(txHistory)}
          />
          <ListItemSecondaryAction>
            <div className={style.badge}>
              <Chip
                color="default"
                size="small"
                label={
                  txHistory?.state === 'success' || txHistory?.state === 'verified'
                    ? 'Success'
                    : [txHistory.state === 'pending' ? 'Pending' : 'Failed']
                }
              />
              <Chip
                className={userId === txHistory?.from ? style.red : style.green}
                color="default"
                size="small"
                label={userId === txHistory?.from ? 'Out' : 'In'}
              />
              <Typography>{txHistory?.value / 1000000000000} Myria</Typography>
            </div>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
