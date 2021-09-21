import React, {useState} from 'react';

import {TransactionHistoryDetail} from '../../interfaces/transaction';
import {BalanceDetailList} from '../BalanceDetailList/BalanceDetailList';
import {HistoryDetailList} from '../HistoryDetailList/HistoryDetailList';
import {BoxComponent} from '../atoms/Box/';
import {TabsComponent} from '../atoms/Tabs/';

// TODO: move this to interfaces/balance.ts when rewiring data
type CurrencyDetail = {
  id: string;
  name: string;
  image: string;
  decimal: number;
  rpcURL: string;
};

export type BalanceDetail = CurrencyDetail & {
  freeBalance: number;
};

type MyWalletProps = {
  headerTitle: string;
  balanceDetails: BalanceDetail[];
  historyDetails: TransactionHistoryDetail[];
};

export const MyWallet: React.FC<MyWalletProps> = props => {
  const {headerTitle, balanceDetails, historyDetails} = props;

  const [tabTexts] = useState([
    {
      id: 'first-tab',
      title: 'Balance',
      component: <BalanceDetailList balanceDetails={balanceDetails} />,
    },
    {
      id: 'second-tab',
      title: 'History',
      component: <HistoryDetailList historyDetails={historyDetails} />,
    },
  ]);

  const handleChangeTab = () => {
    console.log('changed tab!');
  };

  return (
    <BoxComponent
      isWithChevronRightIcon={false}
      title={headerTitle}
      isFitContent={true}
      minWidth={643}>
      <TabsComponent
        active={tabTexts[0].id}
        tabs={tabTexts}
        position={'space-around'}
        mark="underline"
        size="small"
        onChangeTab={handleChangeTab}
        optionalPadding={0}
      />
    </BoxComponent>
  );
};
