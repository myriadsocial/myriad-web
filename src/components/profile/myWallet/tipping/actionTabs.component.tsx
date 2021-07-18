import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { LoadingTransactionComponent } from '../transactions/LoadingTransaction.component';
import { StyledTab } from './styledTab.component';
import { StyledTabs } from './styledTabs.component';
import { useStylesForTabs } from './tabs.styles';

import { TabPanel } from 'src/components/common/tab-panel.component';
import { Transaction } from 'src/interfaces/transaction';
import { User } from 'src/interfaces/user';

const TransactionListComponent = dynamic(() => import('../transactions/transactionList.component'));

interface ActionTabsComponentProps {
  transactions: Transaction[];
  inboundTxs: Transaction[];
  outboundTxs: Transaction[];
  user: User;
}

export const ActionTabsComponent = ({ transactions, inboundTxs, outboundTxs, user }: ActionTabsComponentProps) => {
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
          {loading ? <LoadingTransactionComponent /> : <TransactionListComponent transactions={transactions} user={user} />}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {loading ? <LoadingTransactionComponent /> : <TransactionListComponent transactions={inboundTxs} user={user} />}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {loading ? <LoadingTransactionComponent /> : <TransactionListComponent transactions={outboundTxs} user={user} />}
        </TabPanel>
      </div>
    </div>
  );
};
