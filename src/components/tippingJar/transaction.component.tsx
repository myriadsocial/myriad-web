import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/client';

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
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import RefreshIcon from '@material-ui/icons/Refresh';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import TransactionListComponent from './components/transactionList.component';
import { useTransaction } from './use-transaction.hooks';

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
  const userId = session?.user.address as string;
  const { transactions, inboundTxs, outboundTxs, loadInitTransaction } = useTransaction(userId);
  const [sort, setSort] = useState('');
  const [value, setValue] = useState('0');

  useEffect(() => {
    loadInitTransaction();
  }, []);

  //const getTxHistories = async () => {
  //try {
  //console.log('fetching data....');
  //const userId = session?.user.address;
  //setLoading(true);
  //const response = await client({
  //method: 'GET',
  //url: '/transactions',
  //params: {
  //filter: {
  //offset: 0,
  //limit: 100,
  //skip: 0,
  //where: {},
  //include: ['toUser', 'fromUser']
  //}
  //}
  //});
  //console.log('>>>>', response);

  //// TODO: Move the part below to transaction useTransaction hook

  //if (response.data.length > 0) {
  //const { data } = response;
  //console.log('data fetched!');
  //console.log('>>>> the data is: ', data);
  //const senderAddress = session?.user.address;
  //let tempData = data.filter(function (datum: any) {
  //return datum.from === senderAddress || datum.to === senderAddress;
  //});
  //const sortedTempData = tempData.slice().sort((a: any, b: any) => b.createdAt - a.createdAt);
  //setTxHistories(sortedTempData);
  //const inboundTxs = txHistories.filter(txHistory => {
  //return txHistory.to === session?.user.address;
  //});
  //const outboundTxs = txHistories.filter(txHistory => {
  //return txHistory.from === session?.user.address;
  //});

  //setInboundTxs(inboundTxs);
  //setOutboundTxs(outboundTxs);
  //}
  //} catch (error) {
  //console.log(`error from getTxHistories: ${error}`);
  //}
  //};

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleChangeSort = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSort(event.target.value as string);
  };

  const handleClick = () => {
    loadInitTransaction();
  };

  //if (loading) {
  //return (
  //<div className={style.root}>
  //<Grid container justify="center">
  //<CircularProgress className={style.loading} />
  //</Grid>
  //</div>
  //);
  //} else if (error) {
  //return (
  //<div className={style.root}>
  //<Grid container justify="center">
  //<Typography>Data not available</Typography>
  //</Grid>
  //</div>
  //);
  //}

  return (
    <>
      <div className={style.root}>
        <TabContext value={value}>
          <StyledTabs value={value} onChange={handleChange}>
            <IconButton onClick={handleClick} className={style.iconButton} aria-label="refresh history" component="span">
              <RefreshIcon />
            </IconButton>
            <StyledTab value="0" label="All Tips" {...a11yProps(0)} />
            <StyledTab value="1" label="Received Tips" {...a11yProps(1)} />
            <StyledTab value="2" label="Sent Tips" {...a11yProps(2)} />
          </StyledTabs>
          <List className={style.transactionActionList}>
            <ListItem>
              <FormControl className={style.formControl}>
                <InputLabel id="demo-simple-select-label">Sort/Filter by</InputLabel>
                <Select labelId="filter-tips" id="filter-tips" value={sort} onChange={handleChangeSort}>
                  <MenuItem value={'Date'}>Date</MenuItem>
                  <MenuItem value={'Decreasing Tips'}>Decreasing Tips</MenuItem>
                  <MenuItem value={'Increasing Tips'}>Increasing Tips</MenuItem>
                  <MenuItem value={'Best Tipper'}>Best Tipper</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
          <TabPanel className={style.panel} value={'0'}>
            <List className={style.root}>
              <TransactionListComponent transactions={transactions} userId={userId} />
            </List>
          </TabPanel>
          <TabPanel className={style.panel} value={'1'}>
            <List className={style.root}>
              <></>
            </List>
          </TabPanel>
          <TabPanel className={style.panel} value={'2'}>
            <List className={style.root}>
              <></>
            </List>
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
});
