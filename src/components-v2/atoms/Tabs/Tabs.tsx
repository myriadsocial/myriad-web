import React, {useState, useEffect} from 'react';

import {TabsProps} from '@material-ui/core/Tabs';

import {TabList, TabPosition, TabMark, TabSize} from '../TabList';
import {TabPanel} from '../TabPanel';
import {useStyles} from './Tabs.styles';
import {TabItems} from './Tabs.types';

type TabsComponentProps = TabsProps & {
  tabs: TabItems<string>[];
  active: string;
  position?: TabPosition;
  mark?: TabMark;
  size?: TabSize;
  padding?: number;
  onChangeTab: (currentTab: string) => void;
};

export const TabsComponent: React.FC<TabsComponentProps> = props => {
  const {
    tabs,
    active: defaultActive,
    position = 'space-evenly',
    mark = 'underline',
    size = 'medium',
    onChangeTab,
    padding,
  } = props;

  const styles = useStyles({position, mark, size});

  const [activeTab, setActiveTab] = useState(defaultActive);

  useEffect(() => {
    setActiveTab(defaultActive);
  }, [defaultActive]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChangeTab(tab);
  };

  return (
    <>
      <TabList {...props} onChangeTab={handleTabChange} className={styles.tabs} />

      {tabs.map(tab => (
        <TabPanel key={`tab-panel-${tab.id}`} value={activeTab} index={tab.id} padding={padding}>
          {tab.component}
        </TabPanel>
      ))}
    </>
  );
};
