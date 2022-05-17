import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {TabsComponent} from '../atoms/Tabs/Tabs';
import {useStyles} from './FriendMenu.style';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const FriendListContainer = dynamic(() => import('./FriendList.container'), {ssr: true});
const FriendRequestListContainer = dynamic(() => import('./FriendRequest.container'), {ssr: true});

export const FriendMenuComponent: React.FC = () => {
  const style = useStyles();
  const {query} = useQueryParams();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [activeTab, setActiveTab] = useState<string>('0');

  const tabs = [
    {
      id: '0',
      title: i18n.t('Friends.Container.Tab_Panel_1'),
      component: <FriendListContainer user={user} disableFilter disableSort />,
    },
    {
      id: '1',
      title: i18n.t('Friends.Container.Tab_Panel_2'),
      component: <FriendRequestListContainer user={user} />,
    },
  ];

  useEffect(() => {
    if (query.type === 'request') setActiveTab('1');
  }, [query]);

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={style.padding}>
      <Paper className={style.root}>
        <Typography className={style.title} color="textPrimary">
          {i18n.t('Friends.Container.Title')}
        </Typography>
        <div className={style.tabs}>
          <TabsComponent
            tabs={tabs}
            selected={activeTab}
            size={'small'}
            onChangeTab={handleChangeTab}
          />
        </div>
        <div className={style.mobile}>
          <FriendListContainer user={user} disableFilter disableSort />
        </div>
      </Paper>
    </div>
  );
};
