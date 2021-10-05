import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import {CurrencyDetails} from './currencyDetail.component';
import {StyledTab} from './styledTab.component';
import StyledTabsComponent from './styledTabs.component';
import {useStylesForTabs} from './tabs.styles';

import {TabPanel} from 'src/components/common/tab-panel.component';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {fetchUserTransactionDetails} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

const TokenDetailComponent = () => {
  const classes = useStylesForTabs();
  const dispatch = useDispatch();

  const {
    user,
    currencies: userTokens,
    transactionDetail: userTransactionDetail,
  } = useSelector<RootState, UserState>(state => state.userState);

  const {loading: loadingBalance, balanceDetails} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const {load} = usePolkadotApi();

  if (!user) return null;

  useEffect(() => {
    load(user.id, userTokens);
  }, []);

  useEffect(() => {
    dispatch(fetchUserTransactionDetails());
  }, [dispatch]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress size={20} />
      </Grid>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabsComponent value={value} onChange={handleChange} aria-label="styled tabs example">
          {loadingBalance && balanceDetails.length === 0 && <LoadingComponent />}
          {balanceDetails.map((token, index) => (
            <StyledTab
              label={token.id.toUpperCase()}
              id={`simple-tab-${index}`}
              key={`simple-tab-${index}`}
            />
          ))}
        </StyledTabsComponent>
        {balanceDetails.map((token, index) => (
          <TabPanel value={value} index={index} key={`simple-tab-${index}`}>
            <CurrencyDetails userTransactionDetail={userTransactionDetail} balanceDetail={token} />
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default TokenDetailComponent;
