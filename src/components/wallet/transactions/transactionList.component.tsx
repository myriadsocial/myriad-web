import React, {useState, useEffect} from 'react';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import {format} from 'date-fns';
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function TransactionListComponent({transactions, user}: Props) {
  const style = useStyles();

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const [requestableIds, setRequestableIds] = useState<string[]>([]);

  const userId = user?.id as string;

  const [walletTabIdx, setWalletTabIdx] = useState(0);

  useEffect(() => {
    window.localStorage.setItem('walletTabIdx', String(walletTabIdx));
  }, [walletTabIdx]);

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
    setWalletTabIdx(1);
  };

  const RenderPrimaryText = (txHistory: Transaction) => {
    if (!txHistory) return null;
    return (
      <div>
        {user.id === txHistory.from ? (
          <Typography>
            You sent tips to{' '}
            <Link href={`/${direction(txHistory)}`}>
              <a href={`/${direction(txHistory)}`}>{txHistory.toUser?.name ?? defaultUserName}</a>
            </Link>
            's post with {transformTokenValue(txHistory)} {txHistory.tokenId}
          </Typography>
        ) : txHistory.fromUser?.name === 'Myriad' ? (
          <Typography>
            You get tipping reward in the form of {transformTokenValue(txHistory)}{' '}
            {txHistory.tokenId}
          </Typography>
        ) : (
          <Typography>
            <Link href={`/${direction(txHistory)}`}>
              <a href={`/${direction(txHistory)}`}>{txHistory.fromUser?.name ?? defaultUserName}</a>
            </Link>{' '}
            tipped your post with {transformTokenValue(txHistory)} {txHistory.tokenId}
          </Typography>
        )}
      </div>
    );
  };

  const RenderSecondaryText = (txHistory: Transaction) => {
    if (!txHistory) return null;
    const formatDate = () => {
      return format(new Date(txHistory.createdAt), 'E, d MMM yyyy p');
    };

    return <Typography variant="subtitle2">{formatDate()}</Typography>;
  };

  const defaultUserName = 'Unknown Myrian';

  const direction = (history: Transaction) => {
    if (user.id === history.fromUser?.id) return history.toUser?.id;
    else return history.fromUser?.id;
  };

  return (
    <>
      <List>
        {allTransactions.map(txHistory => (
          <div key={txHistory?.id}>
            <ListItem className={style.transactionItem}>
              <Card>
                <CardHeader
                  avatar={
                    <Link href={`/${direction(txHistory)}`}>
                      <a href={`/${direction(txHistory)}`}>
                        <Avatar
                          aria-label="avatar"
                          src={
                            txHistory?.toUser?.id === userId
                              ? txHistory?.fromUser?.profilePictureURL
                              : txHistory?.toUser?.profilePictureURL
                          }
                        />
                      </a>
                    </Link>
                  }
                  title={RenderPrimaryText(txHistory)}
                  subheader={RenderSecondaryText(txHistory)}
                />
              </Card>
            </ListItem>
          </div>
        ))}
        <Link href={`/${user.id}`} passHref>
          <ListItem>
            <Button
              className={style.expandButton}
              onClick={handleClick}
              variant="contained"
              color="primary"
              fullWidth>
              See Wallet Details
            </Button>
          </ListItem>
        </Link>
      </List>
    </>
  );
}
