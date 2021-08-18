import React from 'react';

import {StyledTabComponent} from './StyledTab.component';
import {StyledTabsComponent} from './StyledTabs.component';
import {TippingComponent} from './myWallet/tipping/tipping.component';
import {WalletComponent} from './myWallet/wallet/wallet.component';
import {useStylesForTabs} from './wallet-tab.styles';

import {TabPanel} from 'src/components/common/tab-panel.component';

export default function MyWalletTabs(): JSX.Element {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabsComponent
          value={value}
          onChange={handleChange}
          aria-label="tabs-for-wallet-or-tipping">
          <StyledTabComponent label="Wallet" />
          <StyledTabComponent label="Tipping" />
        </StyledTabsComponent>
        <TabPanel value={value} index={0}>
          <WalletComponent />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TippingComponent />
        </TabPanel>
      </div>
    </div>
  );
}
