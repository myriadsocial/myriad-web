import { TrendingUpIcon } from '@heroicons/react/outline';

import React, { useState } from 'react';

import dynamic from 'next/dynamic';

import { SvgIcon, Typography } from '@material-ui/core';

import { TabsComponent } from '../atoms/Tabs';
import { useStyles } from './RightMenuBar.styles';

import { useTranslation } from 'react-i18next';

const ExperienceTab = dynamic(() => import('./tabs/ExperienceTab'));
const TrendingExperienceTab = dynamic(
  () => import('./tabs/TrendingExperienceTab'),
);

const CustomFolderIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z"
      stroke="#292D32"
      strokeWidth="1.2"
      strokeMiterlimit="10"
    />
    <path
      d="M16.3992 12.7214V10.9034C16.3992 10.1879 16.1112 9.8999 15.3957 9.8999H13.5777C12.8622 9.8999 12.5742 10.1879 12.5742 10.9034V12.7214C12.5742 13.4369 12.8622 13.7249 13.5777 13.7249H15.3957C16.1112 13.7249 16.3992 13.4369 16.3992 12.7214Z"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2254 12.8339V10.7909C11.2254 10.1564 10.9374 9.8999 10.2219 9.8999H8.40389C7.68839 9.8999 7.40039 10.1564 7.40039 10.7909V12.8294C7.40039 13.4684 7.68839 13.7204 8.40389 13.7204H10.2219C10.9374 13.7249 11.2254 13.4684 11.2254 12.8339Z"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2254 17.8965V16.0785C11.2254 15.363 10.9374 15.075 10.2219 15.075H8.40389C7.68839 15.075 7.40039 15.363 7.40039 16.0785V17.8965C7.40039 18.612 7.68839 18.9 8.40389 18.9H10.2219C10.9374 18.9 11.2254 18.612 11.2254 17.8965Z"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13.25 15.9751H15.95" stroke="#292D32" strokeLinecap="round" />
    <path d="M13.25 17.7749H15.95" stroke="#292D32" strokeLinecap="round" />
  </svg>
);

interface RightMenuBarProps {
  anonymous?: boolean;
}

export const RightMenuBar: React.FC<RightMenuBarProps> = props => {
  const { t } = useTranslation();
  const { anonymous } = props;
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState(
    anonymous ? 'trendingExperienceTabPanel' : 'experienceTabMenu',
  );

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const iconTabs = [
    {
      id: 'experienceTabMenu',
      icon: (
        <div className={classes.tabContainer}>
          <div className="icon">
            <SvgIcon component={CustomFolderIcon} />
          </div>
          <Typography variant="h4">
            {t('Experience.Filter.Following')}
          </Typography>
        </div>
      ),
      component: <ExperienceTab />,
      allowAnonymous: false,
    },
    {
      id: 'trendingExperienceTabPanel',
      icon: (
        <div className={classes.tabContainer}>
          <div className="icon">
            <SvgIcon component={TrendingUpIcon} />
          </div>
          <Typography variant="h4">
            {t('Experience.Filter.Trending')}
          </Typography>
        </div>
      ),
      component: <TrendingExperienceTab />,
      allowAnonymous: true,
    },
  ];

  return (
    <div className={classes.root}>
      <TabsComponent
        selected={activeTab}
        tabs={
          anonymous ? iconTabs.filter(item => item.allowAnonymous) : iconTabs
        }
        position="space-between"
        mark="cover"
        size="medium"
        onChangeTab={handleChangeTab}
        width={anonymous ? '100%' : '48%'}
      />
    </div>
  );
};
