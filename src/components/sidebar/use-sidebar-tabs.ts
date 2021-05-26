import React from 'react';

import dynamic from 'next/dynamic';

import { Language, People, Notifications } from '@material-ui/icons';

const TopicComponent = dynamic(() => import('../topic/topic.component'));
const FriendComponent = dynamic(() => import('../friends/friend.component'));

type TabElemement = {
  title?: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
  default: boolean;
};

export const useSidebarTabs = () => {
  const tabElements: TabElemement[] = [
    {
      title: 'World Wide',
      icon: Language,
      component: TopicComponent,
      default: true
    },
    {
      title: 'Friends',
      icon: People,
      component: FriendComponent,
      default: false
    },
    {
      title: 'Notifications',
      icon: Notifications,
      component: TopicComponent,
      default: false
    }
  ];

  return {
    tabElements
  };
};
