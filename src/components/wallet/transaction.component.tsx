import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
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
import RefreshIcon from '@material-ui/icons/Refresh';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import { useTransaction } from '../tippingJar/use-transaction.hooks';

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
    },
    panel: {
      padding: '4px'
    },
    iconButton: {
      color: '#FFF'
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
  value: string;
}

interface StyledTabsProps {
  value: string;
  onChange: (event: React.ChangeEvent<{}>, newValue: string) => void;
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
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

  const [session] = useSession();
  const userAddress = session?.user.address as string;
  const { loading, error, transactions, inboundTxs, outboundTxs, loadInitTransaction } = useTransaction(userAddress);
  //const [txHistories, setTxHistories] = useState<GetTxHistory[]>([]);
  //const [outboundTxs, setOutboundTxs] = useState<GetTxHistory[]>([]);
  //const [inboundTxs, setInboundTxs] = useState<GetTxHistory[]>([]);
  const [value, setValue] = useState('0');
  //const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadInitTransaction();
  }, []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleClick = () => {
    loadInitTransaction();
  };

  if (loading) {
    return (
      <Grid container justify="center">
        <CircularProgress className={style.loading} />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justify="center">
        <Typography>Error, please try again later!</Typography>
      </Grid>
    );
  }

  if (transactions.length === 0)
    return (
      <Grid container justify="center">
        <Typography>Data not available</Typography>
      </Grid>
    );

  return (
    <>
      <TabContext value={value}>
        <StyledTabs value={value} onChange={handleChange}>
          <IconButton onClick={handleClick} className={style.iconButton} aria-label="refresh history" component="span">
            <RefreshIcon />
          </IconButton>
          <StyledTab value="0" label="All" {...a11yProps(0)} />
          <StyledTab value="1" label="In" {...a11yProps(1)} />
          <StyledTab value="2" label="Out" {...a11yProps(2)} />
        </StyledTabs>
        <TabPanel className={style.panel} value={'0'}>
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
        </TabPanel>
        <TabPanel className={style.panel} value={'1'}>
          <>
            <List className={style.root}>
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
        </TabPanel>
        <TabPanel className={style.panel} value={'2'}>
          <>
            <List className={style.root}>
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
        </TabPanel>
      </TabContext>
    </>
  );
});
