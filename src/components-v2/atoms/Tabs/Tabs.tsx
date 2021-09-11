import React, {useState, useEffect} from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs, {TabsProps} from '@material-ui/core/Tabs';

import {TabPanel} from '../TabPanel';
import {useStyles} from './Tabs.styles';
import {TabList, TabPosition, TabMark, TabSize} from './Tabs.types';

type TabsComponentProps = TabsProps & {
  tabs: TabList<string>[];
  active: string;
  position?: TabPosition;
  mark?: TabMark;
  size?: TabSize;
  onChangeTab: (currentTab: string) => void;
};

export const TabsComponent: React.FC<TabsComponentProps> = props => {
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
    <>
      <Tabs
        value={activeTab}
        indicatorColor={indicatorColor}
        textColor={textColor}
        onChange={handleTabChange}
        className={styles.tabs}>
        {tabs.map(tab => (
          <Tab
            key={`tab-${tab.id}`}
            label={tab.title}
            value={tab.id}
            icon={tab.icon}
            className={styles.tab}
          />
        ))}
      </Tabs>

      {tabs.map(tab => (
        <TabPanel key={`tab-panel-${tab.id}`} value={activeTab} index={tab.id}>
          {tab.component}
        </TabPanel>
      ))}
    </>
  );
};
