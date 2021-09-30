import React, {useState} from 'react';

import {MyWalletProps} from '.';
import {BalanceDetailListContainer} from '../BalanceDetailList/BalanceDetailListContainer';
import {HistoryDetailListContainer} from '../HistoryDetailList/HistoryDetailListContainer';
import {BoxComponent} from '../atoms/Box/';
import {TabsComponent} from '../atoms/Tabs/';

export const MyWallet: React.FC<MyWalletProps> = props => {
  const {headerTitle} = props;

  const [tabTexts] = useState([
    {
      id: 'first-tab',
      title: 'Balance',
      component: <BalanceDetailListContainer />,
    },
    {
      id: 'second-tab',
      title: 'History',
      component: <HistoryDetailListContainer />,
    },
  ]);

  const handleChangeTab = () => {
    console.log('changed tab!');
  };

  const handleClick = () => {
    console.log('open wallet setting!');
  };

  return (
    <BoxComponent
      isWithChevronRightIcon={false}
      title={headerTitle}
      isFitContent={true}
      minWidth={583}
      onClick={handleClick}>
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
