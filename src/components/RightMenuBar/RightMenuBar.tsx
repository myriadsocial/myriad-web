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

export const CustomFolderIcon = () => {
  return (
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
        d="M15.7399 12.5785V10.6717C15.7399 10.0795 15.4711 9.84009 14.8033 9.84009H13.1065C12.4387 9.84009 12.1699 10.0795 12.1699 10.6717V12.5743C12.1699 13.1707 12.4387 13.4059 13.1065 13.4059H14.8033C15.4711 13.4101 15.7399 13.1707 15.7399 12.5785Z"
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.7399 17.3033V15.6065C15.7399 14.9387 15.4711 14.6699 14.8033 14.6699H13.1065C12.4387 14.6699 12.1699 14.9387 12.1699 15.6065V17.3033C12.1699 17.9711 12.4387 18.2399 13.1065 18.2399H14.8033C15.4711 18.2399 15.7399 17.9711 15.7399 17.3033Z"
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9098 12.5785V10.6717C10.9098 10.0795 10.641 9.84009 9.97324 9.84009H8.27644C7.60864 9.84009 7.33984 10.0795 7.33984 10.6717V12.5743C7.33984 13.1707 7.60864 13.4059 8.27644 13.4059H9.97324C10.641 13.4101 10.9098 13.1707 10.9098 12.5785Z"
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9098 17.3033V15.6065C10.9098 14.9387 10.641 14.6699 9.97324 14.6699H8.27644C7.60864 14.6699 7.33984 14.9387 7.33984 15.6065V17.3033C7.33984 17.9711 7.60864 18.2399 8.27644 18.2399H9.97324C10.641 18.2399 10.9098 17.9711 10.9098 17.3033Z"
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const RightMenuBar: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState('experienceTabMenu');

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const iconTabs = [
    {
      id: 'experienceTabMenu',
      icon: (
        <div className={classes.tabContainer}>
          <div className="icon">
            <CustomFolderIcon />
          </div>
          <Typography variant="h4">
            {t('Experience.Filter.Following')}
          </Typography>
        </div>
      ),
      component: <ExperienceTab />,
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
    },
  ];

  return (
    <div className={classes.root}>
      <TabsComponent
        selected={activeTab}
        tabs={iconTabs}
        position="space-between"
        mark="cover"
        size="medium"
        onChangeTab={handleChangeTab}
        width={'48%'}
      />
    </div>
  );
};
