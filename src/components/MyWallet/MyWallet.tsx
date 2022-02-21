import React, {useState, useEffect} from 'react';

import dynamic from 'next/dynamic';

import {MyWalletProps} from '.';
import {BoxComponent} from '../atoms/Box';
import {TabsComponent} from '../atoms/Tabs';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';

const BalanceDetailListContainer = dynamic(
  () => import('../BalanceDetailList/BalanceDetailListContainer'),
  {
    ssr: false,
  },
);
const HistoryDetailListContainer = dynamic(
  () => import('../HistoryDetailList/HistoryDetailListContainer'),
  {
    ssr: false,
  },
);

export const MyWallet: React.FC<MyWalletProps> = props => {
  const {headerTitle} = props;

  const {query} = useQueryParams();

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

  const [activeTabId, setActiveTabId] = useState('first-tab');

  useEffect(() => {
    if (query.type === 'history') setActiveTabId('second-tab');
  }, [query]);

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
        active={activeTabId}
        tabs={tabTexts}
        position={'space-around'}
        mark="underline"
        size="small"
        onChangeTab={handleChangeTab}
        padding={0}
      />
    </BoxComponent>
  );
};
