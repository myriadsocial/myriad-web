import React, {useState} from 'react';

import {MyWalletProps} from '.';
import {BalanceDetailList} from '../BalanceDetailList/BalanceDetailList';
import {HistoryDetailList} from '../HistoryDetailList/HistoryDetailList';
import {BoxComponent} from '../atoms/Box/';
import {TabsComponent} from '../atoms/Tabs/';

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
      minWidth={583}>
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
