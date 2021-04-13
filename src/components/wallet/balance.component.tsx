import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';

import { useMyriadAccount } from './wallet.context';

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
    titleHidden: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontSize: 24,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10
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
  const [isHidden, setIsHidden] = useState(true);
  const { state: myriadAccount, dispatch } = useMyriadAccount();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleIsHidden = () => {
    setIsHidden(!isHidden);
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
          <Typography className={style.title} variant="h5" onClick={handleIsHidden}>
            {isHidden ? 'Classified  ' : myriadAccount.freeBalance.toFixed(3)}
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
