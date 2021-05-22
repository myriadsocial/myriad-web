import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/client';

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import TransactionListComponent from './components/transactionList.component';
import { useTransaction } from './use-transaction.hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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
      margin: '10px',
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
  const { loading, error, transactions, inboundTxs, outboundTxs, loadInitTransaction } = useTransaction(userId);
  const [sort, setSort] = useState({
    type: '',
    direction: ''
  });
  const [value, setValue] = useState('0');

  useEffect(() => {
    loadInitTransaction();
  }, []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleChangeSortType = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSort({
      ...sort,
      type: event.target.value as string
    });
  };

  const handleChangeSortDirection = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSort({
      ...sort,
      direction: event.target.value as string
    });
  };

  const handleClick = () => {
    loadInitTransaction();
  };

  if (loading) {
    return (
      <div className={style.root}>
        <Grid container justify="center">
          <CircularProgress className={style.loading} />
        </Grid>
      </div>
    );
  } else if (error) {
    return (
      <div className={style.root}>
        <Grid container justify="center">
          <Typography>Data not available</Typography>
        </Grid>
      </div>
    );
  }

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
              <FormControl className={style.formControl} id="filter-type">
                <InputLabel id="filter-type">Sort by</InputLabel>
                <Select labelId="filter-type" id="filter-type" value={sort.type} onChange={handleChangeSortType}>
                  <MenuItem value={'Date'}>Date</MenuItem>
                  <MenuItem value={'Tips'}>Amount of Tips</MenuItem>
                  <MenuItem value={'Best Tipper'}>Best Tipper</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={style.formControl} id="filter-direction">
                <InputLabel id="filter-direction">Sort by</InputLabel>
                <Select labelId="filter-direction" id="filter-direction" value={sort.direction} onChange={handleChangeSortDirection}>
                  <MenuItem value={'asc'}>Ascending</MenuItem>
                  <MenuItem value={'desc'}>Descending</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
          <TabPanel className={style.panel} value={'0'}>
            <TransactionListComponent transactions={transactions} userId={userId} sortType={sort.type} sortDirection={sort.direction} />
          </TabPanel>
          <TabPanel className={style.panel} value={'1'}>
            <TransactionListComponent transactions={inboundTxs} userId={userId} sortType={sort.type} sortDirection={sort.direction} />
          </TabPanel>
          <TabPanel className={style.panel} value={'2'}>
            <TransactionListComponent transactions={outboundTxs} userId={userId} sortType={sort.type} sortDirection={sort.direction} />
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
});
