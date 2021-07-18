import React from 'react';

import { CurrencyDetails } from './currencyDetail.component';
import { StyledTab } from './styledTab.component';
import { StyledTabs } from './styledTabs.component';
import { useStylesForTabs } from './tabs.styles';

import { TabPanel } from 'src/components/common/tab-panel.component';
import { Token } from 'src/interfaces/token';

interface TokenDetailComponentProps {
  tokens: Token[];
}

export const TokenDetailComponent = ({ tokens }: TokenDetailComponentProps) => {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
          {tokens.map(token => {
            <StyledTab label={token.token_name} />;
          })}
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
