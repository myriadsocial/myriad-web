import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/client';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import { useTransaction } from '../tippingJar/use-transaction.hooks';
import TransactionListComponent from './transactionList.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const [value, setValue] = useState('0');

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
          <TransactionListComponent transactions={transactions} userId={userAddress} />
        </TabPanel>
        <TabPanel className={style.panel} value={'1'}>
          <TransactionListComponent transactions={inboundTxs} userId={userAddress} />
        </TabPanel>
        <TabPanel className={style.panel} value={'2'}>
          <TransactionListComponent transactions={outboundTxs} userId={userAddress} />
        </TabPanel>
      </TabContext>
    </>
  );
});
