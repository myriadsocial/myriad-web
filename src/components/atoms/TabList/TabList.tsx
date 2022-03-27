import React, {useState, useEffect} from 'react';

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
  background?: string;
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
    background,
    onChangeTab,
  } = props;

  const styles = useStyles({position, mark, size, background});

  const [activeTab, setActiveTab] = useState(defaultActive);

  useEffect(() => {
    setActiveTab(defaultActive);
  }, [defaultActive]);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleTabChange = (event: React.ChangeEvent<{}>, tab: string) => {
    setActiveTab(tab);
    onChangeTab(tab);
  };

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      indicatorColor={indicatorColor}
      textColor={textColor}
      TabIndicatorProps={{
        className: styles.indicatorColor,
        children: <span className={styles.indicator} />,
      }}
      textColor={textColor}
      onChange={handleTabChange}
      classes={{root: styles.tabs}}>
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
