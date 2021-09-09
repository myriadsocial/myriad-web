import React, {useState, useEffect} from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs, {TabsProps} from '@material-ui/core/Tabs';

import {TabPanel} from '../TabPanel';
import {useStyles} from './Tabs.styles';
import {TabList} from './Tabs.types';

type TabsComponentProps = TabsProps & {
  tabs: TabList<string>[];
  active: string;
  onChangeTab: (currentTab: string) => void;
};

export const TabsComponent: React.FC<TabsComponentProps> = props => {
  const {
    tabs,
    active: defaultActive,
    indicatorColor = 'secondary',
    textColor = 'primary',
    onChangeTab,
  } = props;

  const styles = useStyles();

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
          <Tab key={`tab-${tab.id}`} label={tab.title} value={tab.id} icon={tab.icon} />
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
