import {ChatAlt2Icon, HashtagIcon, VariableIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import dynamic from 'next/dynamic';

import {TabsComponent} from '../atoms/Tabs';
import {useStyles} from './RightMenuBar.styles';

const ExperienceTab = dynamic(() => import('./tabs/ExperienceTab'));
const TrendingTab = dynamic(() => import('./tabs/TrendingTab'));

export const RightMenuBar: React.FC = () => {
  const iconTabs = [
    {
      id: 'experienceTabMenu',
      icon: <VariableIcon />,
      component: <ExperienceTab />,
    },
    {
      id: 'trendingTabPanel',
      icon: <HashtagIcon />,
      component: <TrendingTab />,
    },
    {
      id: 'chatTabPanel',
      icon: <ChatAlt2Icon />,
      component: null,
      tooltip: 'Chat feature, coming soon',
      disabled: true,
    },
  ];

  const classes = useStyles();

  const [activeTab, setActiveTab] = useState('experienceTabMenu');

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={classes.root}>
      <TabsComponent
        active={activeTab}
        tabs={iconTabs}
        position={'left'}
        mark="cover"
        size="small"
        onChangeTab={handleChangeTab}
      />
    </div>
  );
};
