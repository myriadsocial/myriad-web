import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';

import Axios from 'axios';

const client = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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
    red: {
      backgroundColor: '#f44336',
      color: '#FFF'
    },
    loading: {
      color: '#A942E9'
    }
  })
);

interface GetTxHistory {
  id: string;
  trxHash: string;
  from: string;
  to: string;
  value: number;
  state: string;
  createdAt: string;
}

export const TransactionComponent = React.memo(function Wallet() {
  const style = useStyles();

  const [txHistories, setTxHistories] = useState<GetTxHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // put the async function below inside the setInterval function
    // periodic calls every 10 s
    //const id = setInterval(() => {
    //}, 10000);

    (async () => {
      await getTxHistories();
    })();
    //return () => clearInterval(id);
  }, []);

  const getTxHistories = async () => {
    try {
      console.log('fetching data....');
      setLoading(true);
      const response = await client({
        method: 'GET',
        url: '/transactions'
      });

      if (response.data.length > 0) {
        const { data } = response;
        console.log('data fetched!');
        console.log(data);
        // get only the first three transactions
        const tempData = data.slice(0, 4);
        setTxHistories(tempData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(`error from getTxHistories: ${error}`);
    }
  };

  const handleClick = async () => {
    await getTxHistories();
  };

  if (loading)
    return (
      <Grid container justify="center">
        <CircularProgress className={style.loading} />
      </Grid>
    );

  if (txHistories.length === 0)
    return (
      <Grid container justify="center">
        <Typography>Data not available</Typography>
      </Grid>
    );

  return (
    <List className={style.root}>
      <ListItem>
        <Button onClick={handleClick}>Refresh history</Button>
      </ListItem>
      {txHistories.map(txHistory => (
        <ListItem key={txHistory?.id}>
          <ListItemAvatar className={style.avatar}>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            className={style.textSecondary}
            secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
            primary={
              <Tooltip title={`${txHistory?.to}`} placement="top" leaveDelay={3000} interactive>
                <Button>To: ...</Button>
              </Tooltip>
            }
            secondary={
              <Tooltip title={`${txHistory?.trxHash}`} placement="top" leaveDelay={3000} interactive>
                <Button>Tx: ...</Button>
              </Tooltip>
            }
          />
          <ListItemSecondaryAction>
            <div className={style.badge}>
              <Chip
                color="default"
                size="small"
                label={txHistory?.state === 'success' ? 'Success' : [txHistory.state === 'pending' ? 'Pending' : 'Failed']}
              />
              <Chip className={style.red} color="default" size="small" label="Out" />
              <Typography>{txHistory?.value} Myria</Typography>
            </div>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
});
