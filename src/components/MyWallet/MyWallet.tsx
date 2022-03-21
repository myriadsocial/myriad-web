import React, {useState, useEffect} from 'react';

import dynamic from 'next/dynamic';

import {MyWalletProps} from '.';
import {TabsComponent} from '../atoms/Tabs';
import {useStyles} from './myWallet.style';

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
const ManageContainer = dynamic(() => import('../Manage/Manage.container'), {
  ssr: false,
});
const TipContainer = dynamic(() => import('../Tip/Tip.container'), {
  ssr: false,
});

export const MyWallet: React.FC<MyWalletProps> = () => {
  const style = useStyles();
  const {query} = useQueryParams();

  const [tabTexts] = useState([
    {
      id: 'balance',
      title: 'Balance',
      component: <BalanceDetailListContainer />,
    },
    {
      id: 'history',
      title: 'History',
      component: <HistoryDetailListContainer />,
    },
    {
      id: 'tip',
      title: 'Tip',
      component: <TipContainer />,
    },
    {
      id: 'manage',
      title: 'Manage',
      component: <ManageContainer />,
    },
  ]);

  const [activeTabId, setActiveTabId] = useState('balance');

  useEffect(() => {
    if (query.type === 'history') setActiveTabId('history');
    if (query.type === 'manage') setActiveTabId('manage');
  }, [query]);

  const handleChangeTab = () => {
    // code
  };

  return (
    <>
      <div className={style.tabsComponent}>
        <TabsComponent
          active={activeTabId}
          tabs={tabTexts}
          position={'left'}
          mark="underline"
          size="small"
          onChangeTab={handleChangeTab}
          padding={0}
        />
      </div>
      <div className={style.mobile}>
        <BalanceDetailListContainer />
      </div>
    </>
  );
};
