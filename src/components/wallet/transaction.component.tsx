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

  const [txHistory, setTxHistory] = useState<GetTxHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // put the async function below inside the setInterval function
    // periodic calls every 10 s
    //const id = setInterval(() => {
    //}, 10000);

    (async () => {
      await getTxHistory();
    })();
    //return () => clearInterval(id);
  }, []);

  const getTxHistory = async () => {
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
        setTxHistory(tempData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(`error from getTxHistory: ${error}`);
    }
  };

  const handleClick = async () => {
    await getTxHistory();
  };

  if (loading)
    return (
      <Grid container justify="center">
        <CircularProgress className={style.loading} />
      </Grid>
    );

  if (txHistory.length === 0)
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
      <ListItem>
        <ListItemAvatar className={style.avatar}>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          className={style.textSecondary}
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          primary={txHistory[0]?.to}
          secondary={`Tx: ${txHistory[0]?.trxHash}`}
        />
        <ListItemSecondaryAction>
          <div className={style.badge}>
            <Chip color="default" size="small" label="Pending" />
            <Chip className={style.red} color="default" size="small" label="Out" />
            <Typography>{txHistory[0]?.value} Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <ListItemAvatar className={style.avatar}>
          <Avatar alt="Travis Howard" src="/images/avatar/2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={txHistory[1]?.to}
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          secondary={`Tx: ${txHistory[1]?.trxHash}`}
        />
        <ListItemSecondaryAction>
          <div className={style.badge}>
            <Chip className={style.green} color="default" size="small" label="In" />
            <Typography>{txHistory[1]?.value} Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <ListItemAvatar className={style.avatar}>
          <Avatar alt="Remy Sharp" src="/images/avatar/3.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={txHistory[2]?.to}
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          secondary={`Tx: ${txHistory[2]?.trxHash}`}
        />
        <ListItemSecondaryAction>
          <div className={style.badge}>
            <Chip className={style.green} color="default" size="small" label="In" />
            <Typography>{txHistory[2]?.value} Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <ListItemAvatar className={style.avatar}>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={txHistory[3]?.to}
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          secondary={`Tx: ${txHistory[3]?.trxHash}`}
        />
        <ListItemSecondaryAction>
          <div className={style.badge}>
            <Chip className={style.green} color="default" size="small" label="In" />
            <Chip className={style.red} color="default" size="small" label="Out" />
            <Typography>{txHistory[3]?.value} Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
});
