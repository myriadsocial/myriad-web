import React, { useEffect, useState, useImperativeHandle } from 'react';

import { useSession } from 'next-auth/client';
import dynamic from 'next/dynamic';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { fade, withStyles, createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';

import { TabPanel } from '../../common/tab-panel.component';
import { useTransaction } from '../../tippingJar/use-transaction.hooks';

import { useUser } from 'src/context/user.context';
import { useToken } from 'src/hooks/use-token.hook';
import { Token } from 'src/interfaces/token';

const TransactionListComponent = dynamic(() => import('./transactionList.component'));

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

interface StyledTabProps {
  label: string;
  ariaLabel?: string;
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#4b4851',
      fontWeight: 'bold',
      fontSize: 18,
      borderRadius: 8,
      minWidth: 74,
      minHeight: 36,
      marginTop: 24,
      '&:focus': {
        opacity: 1,
        backgroundColor: fade('#8629e9', 0.2),
        color: '#8629e9'
      }
    }
  })
)((props: StyledTabProps) => <Tab aria-label={props.ariaLabel} disableRipple {...props} />);

const useStylesForTabs = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1
  },
  padding: {
    padding: theme.spacing(3)
  },
  demo2: {
    backgroundColor: 'transparent'
  }
}));

const TokenDetailComponent = () => {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
          <StyledTab label="Myria" />
          <StyledTab label="Acala" />
          <StyledTab label="Polkadot" />
        </StyledTabs>
        <TabPanel value={value} index={0}>
          <CurrencyDetails />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Acala
        </TabPanel>
        <TabPanel value={value} index={2}>
          Polkadot
        </TabPanel>
      </div>
    </div>
  );
};

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
    paddingTop: 3,
    paddingBottom: 3
  }
})(MuiTableCell);

const useStylesForCurrencyDetails = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(2),
      color: '#E0E0E0'
    },
    title: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontSize: 24
    },
    subtitle: {
      textTransform: 'uppercase',
      fontSize: 12
    },
    gutters: {
      border: `1px solid`,
      borderColor: '#A942E9',
      borderRadius: 8,
      marginBottom: theme.spacing(1)
    },
    icon: {
      minWidth: 40
    },
    showText: {
      width: '100%',
      padding: '2px',
      fontWeight: 600
    },
    balanceText: {
      width: '100%',
      padding: '2px',
      fontWeight: 700
    },
    errorText: {
      color: 'red'
    },
    container: {
      width: '100%',
      backgroundColor: 'transparent',
      position: 'relative',
      margin: '0 4px'
    },
    spinner: {
      color: '#A942E9',
      left: '4px',
      top: '2px',
      position: 'relative'
    },
    tooltipContentHeader: {
      fontWeight: 'bold'
    },
    tooltipContentRoot: { display: 'flex', flexDirection: 'column' },
    buttonContainer: {
      justifyContent: 'center',
      display: 'flex'
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.45),
        color: '#fff'
      },
      '&:active': {
        backgroundColor: '#fff',
        color: theme.palette.primary.main
      }
    },
    green: {
      color: '#4caf50'
    },
    red: {
      color: '#f44336'
    }
  })
);

const CurrencyDetails = () => {
  const style = useStylesForCurrencyDetails();

  function createData(currency: string, balance: string) {
    return { currency, balance };
  }

  const rows = [createData('Total received', '+82.31'), createData('Total sent', '-12.4123')];

  return (
    <TableContainer>
      <Table size="small" aria-label="balance-table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography className={style.balanceText}>ACA</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={style.balanceText}>20</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.currency}>
              <TableCell component="th" scope="row">
                <Typography className={style.balanceText}>{row.currency}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography className={row.currency === 'Total received' ? style.green : style.red}>{row.balance}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

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
    rootPanel: {
      paddingTop: 24,
      paddingBottom: 2
    },
    panelHeader: {
      paddingLeft: 16,
      paddingRight: 16,
      marginBottom: 8
    },
    panelButtons: {
      paddingLeft: 4,
      paddingRight: 4,
      marginBottom: 2
    },
    iconButton: {
      margin: theme.spacing(1)
    }
  })
);

interface TransactionProps {
  forwardedRef: React.ForwardedRef<any>;
  detailed?: boolean;
}

type StyledComponentProps = {
  className?: string;
  tokens: Token[];
};

type TippingJarComponentProps = {
  detailed?: boolean;
};

const TransactionComponent: React.FC<TransactionProps> = ({ forwardedRef, detailed }) => {
  const styles = useStyles();

  const [session] = useSession();
  const {
    state: { user }
  } = useUser();
  const userAddress = session?.user.address as string;
  const { loading, error, transactions, inboundTxs, outboundTxs, loadInitTransaction } = useTransaction(userAddress);
  const { loadAllUserTokens, userTokens } = useToken(userAddress);

  useEffect(() => {
    loadInitTransaction();
    loadAllUserTokens();
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      loadInitTransaction();
    }
  }));

  if (!user) return null;

  const ActionTabsComponent = () => {
    const classes = useStylesForTabs();
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      setInterval(() => {
        setLoading(false);
      }, 2000);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    };

    return (
      <div className={classes.root}>
        <div className={classes.demo2}>
          <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
            <StyledTab label="All" />
            <StyledTab label="Received Tip" />
            <StyledTab label="Sent Tip" />
          </StyledTabs>
          <TabPanel value={value} index={0}>
            {loading ? <LoadingComponent /> : <TransactionListComponent transactions={transactions} user={user} />}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {loading ? <LoadingComponent /> : <TransactionListComponent transactions={inboundTxs} user={user} />}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {loading ? <LoadingComponent /> : <TransactionListComponent transactions={outboundTxs} user={user} />}
          </TabPanel>
        </div>
      </div>
    );
  };

  const TippingJarComponent = ({ detailed }: TippingJarComponentProps) => {
    return (
      <div className={detailed ? '' : styles.rootPanel}>
        {detailed === true ? <ActionTabsComponent /> : <ActionButtonComponent tokens={userTokens} className={styles.panelButtons} />}
      </div>
    );
  };

  const LoadingComponent = () => {
    return (
      <ListItem>
        <Grid container justify="center">
          <CircularProgress className={styles.loading} />
        </Grid>
      </ListItem>
    );
  };

  const ErrorComponent = () => {
    return (
      <ListItem>
        <Grid container justify="center">
          <Typography>Error, please try again later!</Typography>
        </Grid>
      </ListItem>
    );
  };

  const ActionButtonComponent = ({ className, tokens }: StyledComponentProps) => {
    //TODO: token name still hardcoded, will be fixed on next PR
    return (
      <div className={className}>
        <Button variant="contained" color="primary" size="medium" className={styles.iconButton} endIcon={<SortIcon />}>
          Filter by
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          {tokens[0].token_name}
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          {tokens[1].token_name}
        </Button>
      </div>
    );
  };

  const EmptyTransactionComponent = () => {
    return (
      <ListItem>
        <Grid container justify="center">
          <Typography>Data not available</Typography>
        </Grid>
      </ListItem>
    );
  };

  return (
    <div ref={forwardedRef}>
      {detailed === true ? <TokenDetailComponent /> : ''}
      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent />
      ) : transactions.length === 0 ? (
        <EmptyTransactionComponent />
      ) : detailed === true ? (
        <TippingJarComponent detailed={detailed} />
      ) : (
        <TransactionListComponent transactions={transactions} user={user} />
      )}
    </div>
  );
};

export default TransactionComponent;
