import React, {useState, useEffect} from 'react';

import {Tooltip} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs, {TabsProps} from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './TabList.styles';
import {TabListItem, TabPosition, TabMark, TabSize} from './TabList.types';

type TabListProps<T> = TabsProps & {
  tabs: TabListItem<T>[];
  selected: T;
  position?: TabPosition;
  mark?: TabMark;
  size?: TabSize;
  background?: string;
  onChangeTab: (currentTab: T) => void;
};

export const TabList = <T extends unknown>(props: TabListProps<T>): JSX.Element => {
  const {
    tabs,
    selected,
    position = 'space-evenly',
    mark = 'underline',
    textColor = 'primary',
    size = 'medium',
    background,
    onChangeTab,
  } = props;

  const styles = useStyles({position, mark, size, background});

  const [selectedTab, setSelectedTab] = useState<T>(selected);

  useEffect(() => {
    setSelectedTab(selected);
  }, [selected]);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleTabChange = (event: React.ChangeEvent<{}>, tab: T) => {
    setSelectedTab(tab);
    onChangeTab(tab);
  };

  return (
    <Tabs
      value={selectedTab}
      textColor={textColor}
      TabIndicatorProps={{
        className: styles.indicatorColor,
        children: <span className={styles.indicator} />,
      }}
      classes={{root: styles.tabs}}
      onChange={handleTabChange}>
      {tabs.map(tab => {
        if (tab.tooltip) {
          return (
            <Tooltip
              key={`tab-${tab.id}`}
              title={<Typography component="span">{tab.tooltip}</Typography>}
              arrow>
              <span>
                <Tab
                  label={tab.title}
                  value={tab.id}
                  icon={tab.icon}
                  className={styles.tab}
                  disabled={tab.disabled}
                />
              </span>
            </Tooltip>
          );
        } else {
          return (
            <Tab
              key={`tab-${tab.id}`}
              label={tab.title}
              value={tab.id}
              icon={tab.icon}
              className={styles.tab}
            />
          );
        }
      })}
    </Tabs>
  );
};
