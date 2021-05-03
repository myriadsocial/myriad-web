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
import Popover from '@material-ui/core/Popover';
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
    },
    typography: {
      padding: theme.spacing(2)
    }
  })
);

export default function TransactionListComponent({ transactions, userId }: Props) {
  const style = useStyles();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [tipsReceivedDetails, setTipsReceivedDetails] = useState({
    total: null,
    senderAddress: ''
  });
  const [tipsSentDetails, setTipsSentDetails] = useState({
    total: null,
    receiverAddress: ''
  });

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setAllTransactions(transactions);

    if (transactions.length > 0) {
      totalTipsReceived();
      totalTipsSent();
    }
  }, [transactions]);

  const totalTipsReceived = () => {
    let temp = transactions.filter((el: object) => {
      return el.to === userId;
    });

    let total = temp.map((el: object) => {
      return el.value / 1000000000000;
    });

    let senderAddress = temp.map((el: object) => {
      return el.from;
    });

    setTipsReceivedDetails({
      ...tipsReceivedDetails,
      total: total[0],
      senderAddress: senderAddress[0]
    });
    console.log('>>> tips details: ', tipsReceivedDetails);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const totalTipsSent = () => {
    let temp = transactions.filter((el: object) => {
      return el.from === userId;
    });

    let total = temp.map((el: object) => {
      return el.value / 1000000000000;
    });

    let receiverAddress = temp.map((el: object) => {
      return el.to;
    });

    setTipsSentDetails({
      ...tipsSentDetails,
      total: total[0],
      receiverAddress: receiverAddress[0]
    });
    console.log('>>> tips details: ', tipsSentDetails);
  };

  if (transactions.length === 0) return null;

  const renderTransactionDetail = (txHistory: Transaction) => {
    const formatDate = () => {
      let formattedDate = new Date(txHistory?.createdAt);
      return formattedDate.toUTCString();
    };

    return (
      <div>
        <div>
          <Button onClick={handleClick}>
            Username:{' '}
            {userId === txHistory?.from
              ? txHistory?.hasOwnProperty('toUser') === false
                ? 'Unknown User'
                : txHistory?.toUser?.name
              : txHistory?.hasOwnProperty('fromUser') === false
              ? 'Unknown User'
              : txHistory?.fromUser?.name}{' '}
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}>
            <Typography className={classes.typography}>The content of the Popover.</Typography>
          </Popover>
          <Button className={style.received}>
            Total tips sent to me: {tipsReceivedDetails?.senderAddress === txHistory?.from ? tipsReceivedDetails?.total : '---'} MYRIA
          </Button>
          <Button className={style.received}>Sender Address: {tipsReceivedDetails?.senderAddress}</Button>
          <Button className={style.received}>Sender Address: {txHistory?.from}</Button>
        </div>
        <div>
          <Button>Transaction date: {formatDate()}</Button>
          <Button className={style.sent}>
            Total tips sent to them: {tipsSentDetails?.receiverAddress === txHistory?.to ? tipsSentDetails?.total : '---'} MYRIA
          </Button>
        </div>
      </div>
    );
  };
  console.log('the transaction data: ', transactions);

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
            primary={renderTransactionDetail(txHistory)}
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
