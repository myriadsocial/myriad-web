import {ChatAlt2Icon, HashtagIcon, VariableIcon, TrendingUpIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import dynamic from 'next/dynamic';

import {SvgIcon} from '@material-ui/core';

import {TabsComponent} from '../atoms/Tabs';
import {useStyles} from './RightMenuBar.styles';

const ExperienceTab = dynamic(() => import('./tabs/ExperienceTab'));
const TrendingTab = dynamic(() => import('./tabs/TrendingTab'));
const TrendingExperienceTab = dynamic(() => import('./tabs/TrendingExperienceTab'));

export const RightMenuBar: React.FC = () => {
  const iconTabs = [
    {
      id: 'trendingExperienceTabPanel',
      icon: <SvgIcon component={TrendingUpIcon} />,
      component: <TrendingExperienceTab />,
    },
    {
      id: 'experienceTabMenu',
      icon: <SvgIcon component={VariableIcon} />,
      component: <ExperienceTab />,
    },
    {
      id: 'trendingTabPanel',
      icon: <SvgIcon component={HashtagIcon} />,
      component: <TrendingTab />,
    },
    {
      id: 'chatTabPanel',
      icon: <SvgIcon component={ChatAlt2Icon} />,
      component: null,
      tooltip: 'Chat feature, coming soon',
      disabled: true,
    },
  ];

  const classes = useStyles();

  const [activeTab, setActiveTab] = useState('trendingExperienceTabPanel');

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={classes.root}>
      <TabsComponent
        selected={activeTab}
        tabs={iconTabs}
        position="left"
        mark="cover"
        size="small"
        onChangeTab={handleChangeTab}
      />
    </div>
  );
};
