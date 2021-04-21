import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/client';

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
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';
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

interface StyledTabProps {
  label: string;
}

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  flexContainer: {
    justifyContent: 'flex-end'
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#A942E9',
    '& > span': {
      maxWidth: 40,
      width: '100%'
      // backgroundColor: '#616161'
    }
  }
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'uppercase',
      color: theme.palette.common.white,
      minWidth: 40,
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1
      }
    }
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

export const TransactionComponent = React.memo(function Wallet() {
  const style = useStyles();

  const [txHistories, setTxHistories] = useState<GetTxHistory[]>([]);
  const [outboundTxs, setOutboundTxs] = useState<GetTxHistory[]>([]);
  const [inboundTxs, setInboundTxs] = useState<GetTxHistory[]>([]);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [session] = useSession();

  useEffect(() => {
    (async () => {
      await getTxHistories();
    })();
    if (txHistories.length > 0) {
      setLoading(true);
      const inboundTxs = txHistories.filter(txHistory => {
        return txHistory.to === session?.user.address;
      });
      const outboundTxs = txHistories.filter(txHistory => {
        return txHistory.from === session?.user.address;
      });

      setInboundTxs(inboundTxs);
      setInboundTxs.length > 0 ? setLoading(false) : setLoading(true);
      setOutboundTxs(outboundTxs);
      setOutboundTxs.length > 0 ? setLoading(false) : setLoading(true);
      console.log('outboundTxs', outboundTxs);
    }
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
        const senderAddress = session?.user.address;
        let tempData = data.filter(function (datum: any) {
          return datum.from === senderAddress || datum.to === senderAddress;
        });
        const sortedTempData = tempData.slice().sort((a: any, b: any) => b.createdAt - a.createdAt);
        setTxHistories(sortedTempData);
        console.log('sorted TxHistories: ', sortedTempData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(`error from getTxHistories: ${error}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
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

  const StyledCustomTabs = () => {
    return (
      <StyledTabs value={value} onChange={handleChange}>
        <StyledTab label="All" />
        <StyledTab label="In" />
        <StyledTab label="Out" />
      </StyledTabs>
    );
  };

  if (value === 1) {
    return (
      <>
        <StyledCustomTabs />
        <List className={style.root}>
          <ListItem>
            <Button onClick={handleClick}>Refresh history</Button>
          </ListItem>
          {inboundTxs.map(inboundTx => (
            <ListItem key={inboundTx?.id}>
              <ListItemAvatar className={style.avatar}>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                className={style.textSecondary}
                secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
                primary={
                  <Tooltip title={`${inboundTx?.from}`} placement="top" leaveDelay={3000} interactive>
                    <Button>From: ...</Button>
                  </Tooltip>
                }
                secondary={
                  <Tooltip title={`${inboundTx?.trxHash}`} placement="top" leaveDelay={3000} interactive>
                    <Button>Tx: ...</Button>
                  </Tooltip>
                }
              />
              <ListItemSecondaryAction>
                <div className={style.badge}>
                  <Chip
                    color="default"
                    size="small"
                    label={
                      inboundTx?.state === 'success' || inboundTx?.state === 'verified'
                        ? 'Success'
                        : [inboundTx?.state === 'pending' ? 'Pending' : 'Failed']
                    }
                  />
                  <Chip className={style.green} color="default" size="small" label="In" />
                  <Typography>{inboundTx?.value / 1000000000000} Myria</Typography>
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </>
    );
  }

  if (value === 2) {
    return (
      <>
        <StyledCustomTabs />
        <List className={style.root}>
          <ListItem>
            <Button onClick={handleClick}>Refresh history</Button>
          </ListItem>
          {outboundTxs.map(outboundTx => (
            <ListItem key={outboundTx?.id}>
              <ListItemAvatar className={style.avatar}>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                className={style.textSecondary}
                secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
                primary={
                  <Tooltip title={`${outboundTx?.to}`} placement="top" leaveDelay={3000} interactive>
                    <Button>To: ...</Button>
                  </Tooltip>
                }
                secondary={
                  <Tooltip title={`${outboundTx?.trxHash}`} placement="top" leaveDelay={3000} interactive>
                    <Button>Tx: ...</Button>
                  </Tooltip>
                }
              />
              <ListItemSecondaryAction>
                <div className={style.badge}>
                  <Chip
                    color="default"
                    size="small"
                    label={
                      outboundTx?.state === 'success' || outboundTx?.state === 'verified'
                        ? 'Success'
                        : [outboundTx?.state === 'pending' ? 'Pending' : 'Failed']
                    }
                  />
                  <Chip className={style.red} color="default" size="small" label="Out" />
                  <Typography>{outboundTx?.value / 1000000000000} Myria</Typography>
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </>
    );
  }

  return (
    <>
      <StyledTabs value={value} onChange={handleChange}>
        <StyledTab label="All" />
        <StyledTab label="In" />
        <StyledTab label="Out" />
      </StyledTabs>
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
                session?.user.address === txHistory?.from ? (
                  <Tooltip title={`${txHistory?.to}`} placement="top" leaveDelay={3000} interactive>
                    <Button>To: ...</Button>
                  </Tooltip>
                ) : (
                  <Tooltip title={`${txHistory?.from}`} placement="top" leaveDelay={3000} interactive>
                    <Button>From: ...</Button>
                  </Tooltip>
                )
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
                  label={
                    txHistory?.state === 'success' || txHistory?.state === 'verified'
                      ? 'Success'
                      : [txHistory.state === 'pending' ? 'Pending' : 'Failed']
                  }
                />
                <Chip
                  className={session?.user.address === txHistory?.from ? style.red : style.green}
                  color="default"
                  size="small"
                  label={session?.user.address === txHistory?.from ? 'Out' : 'In'}
                />
                <Typography>{txHistory?.value / 1000000000000} Myria</Typography>
              </div>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
});
