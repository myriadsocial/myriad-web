import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {TabsComponent} from '../atoms/Tabs/Tabs';
import {FriendListContainer} from './FriendList.container';
import {FriendRequestListContainer} from './FriendRequest.container';
import {useStyles} from './friend.style';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const FriendMenuComponent: React.FC = () => {
  const style = useStyles();
  const {query} = useQueryParams();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [activeTab, setActiveTab] = useState<string>('0');

  const tabs = [
    {
      id: '0',
      title: 'Friend List',
      component: <FriendListContainer user={user} disableFilter />,
    },
    {
      id: '1',
      title: 'Friend Request',
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
    <Paper className={style.root}>
      <Typography className={style.title} color="textPrimary">
        Friends
      </Typography>
      <TabsComponent
        tabs={tabs}
        active={activeTab}
        size={'small'}
        onChangeTab={handleChangeTab}
        paddingLeft={30}
        paddingRight={30}
      />
    </Paper>
  );
};
