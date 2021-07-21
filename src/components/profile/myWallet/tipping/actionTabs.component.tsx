import React, {useEffect, useState} from 'react';

import dynamic from 'next/dynamic';

import {LoadingTransactionComponent} from '../transactions/LoadingTransaction.component';
import {StyledTab} from './styledTab.component';
import StyledTabsComponent from './styledTabs.component';
import {useStylesForTabs} from './tabs.styles';

import {TabPanel} from 'src/components/common/tab-panel.component';
import {Transaction} from 'src/interfaces/transaction';
import {User} from 'src/interfaces/user';

const TransactionListComponent = dynamic(() => import('../transactions/transactionList.component'));

interface ActionTabsComponentProps {
  transactions: Transaction[];
  inboundTxs: Transaction[];
  outboundTxs: Transaction[];
  user: User;
}

const ActionTabsComponent = ({
  transactions,
  inboundTxs,
  outboundTxs,
  user,
}: ActionTabsComponentProps) => {
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

  const TabSections = ['All', 'Received Tip', 'Sent Tip'];

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabsComponent value={value} onChange={handleChange} aria-label="styled tabs example">
          {TabSections.map((section, index) => (
            <StyledTab
              label={section}
              id={`simple-tab-${index}-${section}`}
              key={`simple-tab-${index}-${section}`}
            />
          ))}
        </StyledTabsComponent>
        <TabPanel value={value} index={0}>
          {loading ? (
            <LoadingTransactionComponent />
          ) : (
            <TransactionListComponent transactions={transactions} user={user} />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {loading ? (
            <LoadingTransactionComponent />
          ) : (
            <TransactionListComponent transactions={inboundTxs} user={user} />
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {loading ? (
            <LoadingTransactionComponent />
          ) : (
            <TransactionListComponent transactions={outboundTxs} user={user} />
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default ActionTabsComponent;
