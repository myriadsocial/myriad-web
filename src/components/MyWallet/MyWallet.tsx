import React, {useState, useEffect} from 'react';

import {MyWalletProps} from '.';
import {BalanceDetailListContainer} from '../BalanceDetailList/BalanceDetailListContainer';
import {HistoryDetailListContainer} from '../HistoryDetailList/HistoryDetailListContainer';
import {BoxComponent} from '../atoms/Box';
import {TabsComponent} from '../atoms/Tabs';
import {useStyles} from './myWallet.style';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';

export const MyWallet: React.FC<MyWalletProps> = props => {
  const {headerTitle} = props;
  const style = useStyles();
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
    <BoxComponent isWithChevronRightIcon={false} title={headerTitle} onClick={handleClick}>
      <div className={style.tabsComponent}>
        <TabsComponent
          active={activeTabId}
          tabs={tabTexts}
          position={'space-around'}
          mark="underline"
          size="small"
          onChangeTab={handleChangeTab}
          padding={0}
        />
      </div>
      <div className={style.mobile}>
        <BalanceDetailListContainer />
      </div>
    </BoxComponent>
  );
};
