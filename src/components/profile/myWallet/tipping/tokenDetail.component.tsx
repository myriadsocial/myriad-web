import React from 'react';

import {CurrencyDetails} from './currencyDetail.component';
import {StyledTab} from './styledTab.component';
import StyledTabsComponent from './styledTabs.component';
import {useStylesForTabs} from './tabs.styles';

import {TabPanel} from 'src/components/common/tab-panel.component';
import {BalanceDetail} from 'src/interfaces/balance';
import {UserTransactionDetail} from 'src/interfaces/user';

interface TokenDetailComponentProps {
  balanceDetails: BalanceDetail[];
  userTransactionDetails: UserTransactionDetail[];
}

const TokenDetailComponent = ({
  balanceDetails,
  userTransactionDetails,
}: TokenDetailComponentProps) => {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabsComponent value={value} onChange={handleChange} aria-label="styled tabs example">
          {balanceDetails.map((token, index) => (
            <StyledTab
              label={token.tokenSymbol.toUpperCase()}
              id={`simple-tab-${index}`}
              key={`simple-tab-${index}`}
            />
          ))}
        </StyledTabsComponent>
        {balanceDetails.map((token, index) => (
          <TabPanel value={value} index={index} key={`simple-tab-${index}`}>
            <CurrencyDetails
              userTransactionDetails={userTransactionDetails}
              balanceDetail={token}
            />
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default TokenDetailComponent;
