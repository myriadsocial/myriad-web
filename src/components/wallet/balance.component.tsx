import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';

import { connectToBlockchain } from '../../helpers/polkadotApi';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#424242',
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
    }
  })
);

export const BalanceComponent = React.memo(function Wallet() {
  const style = useStyles();
  const [value, setValue] = useState(0);
  const [api, setApi] = useState(null);
  const [freeBalance, setFreeBalance] = useState(null);

  useEffect(async () => {
    const balance = await getBalance();
    setFreeBalance(`${balance}`);
  }, []);

  const getBalance = async () => {
    const DECIMAL_PLACES = 10000000000;
    const ADDR = '5CS8upU5c44NaPu7qiSXGwna7oeDGG3vifM5nZAbwx3nTGTm';
    const api = await connectToBlockchain();
    const {
      data: { free: previousFree },
      nonce: previousNonce
    } = await api.query.system.account(ADDR);
    return (previousFree / DECIMAL_PLACES).toFixed(3);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <div className={style.root}>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <Typography className={style.title} variant="h5">
            Total Balance
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={style.title} variant="h5">
            {freeBalance}
            <span className={style.subtitle}>Myria</span>
          </Typography>
        </Grid>
      </Grid>
      <StyledTabs value={value} onChange={handleChange}>
        <StyledTab label="All" />
        <StyledTab label="In" />
        <StyledTab label="Out" />
      </StyledTabs>
    </div>
  );
});
