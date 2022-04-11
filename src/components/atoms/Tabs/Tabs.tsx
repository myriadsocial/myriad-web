import React, {useState, useEffect} from 'react';

import {TabsProps} from '@material-ui/core/Tabs';

import {TabList, TabPosition, TabMark, TabSize} from '../TabList';
import {TabPanel} from '../TabPanel';
import {useStyles} from './Tabs.styles';
import {TabItems} from './Tabs.types';

type TabsComponentProps<T> = TabsProps & {
  tabs: TabItems<T>[];
  selected: T;
  position?: TabPosition;
  mark?: TabMark;
  size?: TabSize;
  background?: string;
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  onChangeTab: (currentTab: T) => void;
};

export const TabsComponent = <T extends unknown>(props: TabsComponentProps<T>): JSX.Element => {
  const {
    tabs,
    selected,
    position = 'space-evenly',
    mark = 'underline',
    size = 'medium',
    onChangeTab,
    padding,
    paddingRight,
    paddingLeft,
  } = props;

  const styles = useStyles({position, mark, size});

  const [selectedTab, setSelectedTab] = useState<T>(selected);

  useEffect(() => {
    setSelectedTab(selected);
  }, [selected]);

  const handleTabChange = (tab: T) => {
    setSelectedTab(tab);
    onChangeTab(tab);
  };

  return (
    <>
      <TabList {...props} onChangeTab={handleTabChange} className={styles.tabs} />

      {tabs.map(tab => {
        return tab.id === selectedTab ? (
          <TabPanel
            key={`tab-panel-${tab.id}`}
            value={selectedTab}
            index={tab.id}
            padding={padding}
            paddingLeft={paddingLeft}
            paddingRight={paddingRight}>
            {tab.component}
          </TabPanel>
        ) : null;
      })}
    </>
  );
};
