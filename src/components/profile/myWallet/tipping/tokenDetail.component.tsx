import React from 'react';

// TODO: use CurrencyDetails to list the Total Received, Total Sent of each token
//import {CurrencyDetails} from './currencyDetail.component';
import {StyledTab} from './styledTab.component';
import StyledTabsComponent from './styledTabs.component';
import {useStylesForTabs} from './tabs.styles';

import {TabPanel} from 'src/components/common/tab-panel.component';
import {Token} from 'src/interfaces/token';

interface TokenDetailComponentProps {
  tokens: Token[];
}

const TokenDetailComponent = ({tokens}: TokenDetailComponentProps) => {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabsComponent value={value} onChange={handleChange} aria-label="styled tabs example">
          {tokens.map((token, index) => (
            <StyledTab
              label={token.token_name.toUpperCase()}
              id={`simple-tab-${index}`}
              key={`simple-tab-${index}`}
            />
          ))}
        </StyledTabsComponent>
        {tokens.map((tokens, index) => (
          <TabPanel value={value} index={index} key={`simple-tab-${index}`}>
            {tokens.token_name}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default TokenDetailComponent;
