import React, { useState, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

//import { useFriendsHook } from 'src/components/friends/use-friends-hook';
import { Transaction } from 'src/interfaces/transaction';
import { User } from 'src/interfaces/user';

type Props = {
  transactions: Transaction[];
  user: User;
  sortType?: string;
  sortDirection?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
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
    transactionItem: {
      background: '#DDDDDD',
      '& .MuiCardHeader-root, & .MuiCardActions-root': {
        background: '#EFEFEF'
      }
    },
    transactionActionList: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      alignItems: 'flex-start'
    },
    iconButton: {
      margin: theme.spacing(1)
    },
    expandButton: {
      justifyContent: 'center'
    },
    typography: {
      padding: theme.spacing(2)
    }
  })
);

export default function TransactionListComponent({ transactions, user }: Props) {
  const style = useStyles();
  const [expandable, setExpandable] = useState(true);

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  //const { sendRequest } = useFriendsHook(user);

  const userId = user?.id as string;

  useEffect(() => {
    setAllTransactions(transactions);
  }, []);

  if (transactions.length === 0) return null;

  const handleClick = () => {
    setExpandable(!expandable);
  };

  //TODO: try the function below for add friend button
  //const sendFriendRequest = (txHistory: Transaction) => {
  //console.log('sendFriendRequest', txHistory);
  //if (txHistory.fromUser) {
  //sendRequest(txHistory.fromUser.id);
  //}
  //};

  const RenderPrimaryText = (txHistory: Transaction) => {
    return (
      <div>
        {user.id === txHistory?.from ? (
          <Typography>
            You sent tips to {txHistory?.toUser?.name ?? defaultUserName}'s post with {txHistory?.value / 1000000000000} ACA coins
          </Typography>
        ) : (
          <Typography>
            {txHistory?.fromUser?.name ?? defaultUserName} tipped your post with {txHistory?.value / 1000000000000} ACA coins
          </Typography>
        )}
      </div>
    );
  };

  const RenderSecondaryText = (txHistory: Transaction) => {
    const formatDate = () => {
      let formattedDate = new Date(txHistory?.createdAt);
      return formattedDate.toUTCString();
    };

    return <Typography variant="subtitle2">{formatDate()}</Typography>;
  };

  const defaultUserName = 'Unknown Myrian';

  const CardActionButtons = () => {
    return (
      <CardActions>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button size="medium" variant="contained" color="default" className={style.iconButton}>
            Visit Profile
          </Button>
          <Button size="medium" variant="contained" color="primary" className={style.iconButton} startIcon={<PersonAddIcon />}>
            Add Friend
          </Button>
        </div>
      </CardActions>
    );
  };

  const ExpandMore = () => {
    return (
      <ListItem className={style.expandButton}>
        <Button onClick={handleClick}>See more</Button>
      </ListItem>
    );
  };

  return (
    <>
      <List>
        {expandable
          ? allTransactions.slice(0, 2).map(txHistory => (
              <div key={txHistory?.id}>
                <ListItem className={style.transactionItem}>
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label="avatar"
                          src={
                            txHistory?.toUser?.id === userId ? txHistory?.fromUser?.profilePictureURL : txHistory?.toUser?.profilePictureURL
                          }
                        />
                      }
                      title={RenderPrimaryText(txHistory)}
                      subheader={RenderSecondaryText(txHistory)}
                    />
                    <CardActionButtons />
                  </Card>
                </ListItem>
              </div>
            ))
          : allTransactions.map(txHistory => (
              <div key={txHistory?.id}>
                <ListItem className={style.transactionItem}>
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label="avatar"
                          src={
                            txHistory?.toUser?.id === userId ? txHistory?.fromUser?.profilePictureURL : txHistory?.toUser?.profilePictureURL
                          }
                        />
                      }
                      title={RenderPrimaryText(txHistory)}
                      subheader={RenderSecondaryText(txHistory)}
                    />
                    <CardActionButtons />
                  </Card>
                </ListItem>
              </div>
            ))}
      </List>
      {expandable ? (
        <ExpandMore />
      ) : (
        <ListItem className={style.expandButton}>
          <Button onClick={handleClick}>See less</Button>
        </ListItem>
      )}
    </>
  );
}
