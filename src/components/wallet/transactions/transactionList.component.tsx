import React, {useState, useEffect} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import {useStyles} from 'src/components/wallet/transactions/transactionList-style';
import {transformTokenValue} from 'src/helpers/transformTokenValue';
import {Transaction} from 'src/interfaces/transaction';
import {User} from 'src/interfaces/user';

interface Props {
  transactions: Transaction[];
  user: User;
  sortType?: string;
  sortDirection?: string;
}

export default function TransactionListComponent({transactions, user}: Props) {
  const style = useStyles();

  const [expandable, setExpandable] = useState(true);

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const [requestableIds, setRequestableIds] = useState<string[]>([]);

  const userId = user?.id as string;

  useEffect(() => {
    setAllTransactions(transactions);
    const ids = transactions.reduce((result, item) => {
      if (item.from === userId) {
        result.push(item.to);
      } else {
        result.push(item.from);
      }
      return result;
    }, [] as Array<string>);

    setRequestableIds(ids);
  }, []);

  useEffect(() => {
    if (requestableIds.length > 0) {
      //const checked = checkFriendStatus(requestableIds);
    }
  }, [requestableIds]);

  if (transactions.length === 0) return null;

  const handleClick = () => {
    setExpandable(!expandable);
  };

  const RenderPrimaryText = (txHistory: Transaction) => {
    if (!txHistory) return null;
    return (
      <div>
        {user.id === txHistory.from ? (
          <Typography>
            You sent tips to {txHistory.toUser?.name ?? defaultUserName}'s post with{' '}
            {transformTokenValue(txHistory)} {txHistory.tokenId} coins
          </Typography>
        ) : (
          <Typography>
            {txHistory.fromUser?.name ?? defaultUserName} tipped your post with{' '}
            {transformTokenValue(txHistory)} {txHistory.tokenId} coins
          </Typography>
        )}
      </div>
    );
  };

  const RenderSecondaryText = (txHistory: Transaction) => {
    if (!txHistory) return null;
    const formatDate = () => {
      const formattedDate = new Date(txHistory.createdAt);
      return formattedDate.toUTCString();
    };

    return <Typography variant="subtitle2">{formatDate()}</Typography>;
  };

  const defaultUserName = 'Unknown Myrian';

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
                            txHistory?.toUser?.id === userId
                              ? txHistory?.fromUser?.profilePictureURL
                              : txHistory?.toUser?.profilePictureURL
                          }
                        />
                      }
                      title={RenderPrimaryText(txHistory)}
                      subheader={RenderSecondaryText(txHistory)}
                    />
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
                            txHistory?.toUser?.id === userId
                              ? txHistory?.fromUser?.profilePictureURL
                              : txHistory?.toUser?.profilePictureURL
                          }
                        />
                      }
                      title={RenderPrimaryText(txHistory)}
                      subheader={RenderSecondaryText(txHistory)}
                    />
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
