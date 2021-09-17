import React, {useState} from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {TabsComponent} from '../atoms/Tabs/Tabs';
import {friends} from './default';
import {FriendListComponent} from './friend-list';
import {FriendRequestComponent} from './friend-request';
import {useStyles} from './friend.style';

export const FriendComponent: React.FC = () => {
  const style = useStyles();
  const tabs = [
    {
      id: '0',
      title: 'Friend List',
      component: <FriendListComponent background friends={friends} />,
    },
    {
      id: '1',
      title: 'Friend Request',
      component: <FriendRequestComponent />,
    },
  ];
  const [activeTab, setActiveTab] = useState<string>('0');

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Paper className={style.root}>
      <Typography className={style.title} color="textPrimary">
        Friends
      </Typography>
      <TabsComponent tabs={tabs} active={activeTab} size={'small'} onChangeTab={handleChangeTab} />
    </Paper>
  );
};
