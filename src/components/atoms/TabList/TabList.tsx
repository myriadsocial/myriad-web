import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import {Tooltip} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs, {TabsProps} from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './TabList.styles';
import {TabListItem, TabPosition, TabMark, TabSize} from './TabList.types';

type TabListProps = TabsProps & {
  tabs: TabListItem<string>[];
  active: string;
  position?: TabPosition;
  mark?: TabMark;
  size?: TabSize;
  onChangeTab: (currentTab: string) => void;
};

export const TabList: React.FC<TabListProps> = props => {
  const {
    tabs,
    active: defaultActive,
    position = 'space-evenly',
    mark = 'underline',
    indicatorColor = 'secondary',
    textColor = 'primary',
    size = 'medium',
    onChangeTab,
  } = props;

  const router = useRouter();

  const styles = useStyles({position, mark, size});

  const [activeTab, setActiveTab] = useState(defaultActive);

  useEffect(() => {
    setActiveTab(defaultActive);
  }, [defaultActive]);

  const handleTabChange = (event: React.ChangeEvent<{}>, tab: string) => {
    setActiveTab(tab);
    onChangeTab(tab);
  };

  return (
    <div
      style={{
        background:
          router.pathname === '/profile/[id]' && mark === 'underline' ? 'white' : 'transparent',
      }}>
      <Tabs
        value={activeTab}
        indicatorColor={indicatorColor}
        TabIndicatorProps={{
          color: 'transparent',
          children: <span className={styles.indicator} />,
        }}
        textColor={textColor}
        onChange={handleTabChange}
        className={styles.tabs}>
        {tabs.map(tab => {
          {
            if (tab.id === 'chatTabPanel')
              return (
                <Tooltip
                  key={`tab-${tab.id}`}
                  title={<Typography component="span">Chat feature, coming soon</Typography>}
                  arrow>
                  <span>
                    <Tab
                      label={tab.title}
                      value={tab.id}
                      icon={tab.icon}
                      className={styles.tab}
                      disabled={true}
                    />
                  </span>
                </Tooltip>
              );
          }

          return (
            <Tab
              key={`tab-${tab.id}`}
              label={tab.title}
              value={tab.id}
              icon={tab.icon}
              className={styles.tab}
            />
          );
        })}
      </Tabs>
    </div>
  );
};
