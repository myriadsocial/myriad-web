import React, { useState, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import RefreshIcon from '@material-ui/icons/Refresh';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import { Transaction } from 'src/interfaces/transaction';

type Props = {
  transactions: Transaction[];
  userId: string;
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
    }
  })
);

export default function TransactionListComponent({ transactions, userId }: Props) {
  const style = useStyles();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setAllTransactions(transactions);
  }, [transactions]);

  if (transactions.length === 0) return null;

  const renderTransactionDetail = (txHistory: Transaction) => {
    return (
      <div>
        <div>
          <Button>Username: {txHistory?.fromUser || txHistory?.toUser} </Button>
          <Button className={style.received}>Total tips sent to me: ... MYRIA</Button>
        </div>
        <div>
          <Button>Transaction date: ...</Button>
          <Button className={style.sent}>Total tips sent to them: ... MYRIA</Button>
        </div>
      </div>
    );
  };
  console.log('transactions', transactions);

  return (
    <List className={style.root}>
      {transactions.map(txHistory => (
        <ListItem key={txHistory?.id}>
          <ListItemAvatar className={style.avatar}>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            className={style.textSecondary}
            secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
            primary={renderTransactionDetail}
            secondary={
              <>
                <Button>Tx Hash: {txHistory?.trxHash}</Button>
              </>
            }
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
