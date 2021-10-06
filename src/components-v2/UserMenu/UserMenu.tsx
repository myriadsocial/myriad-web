import React, {useState} from 'react';

import Paper from '@material-ui/core/Paper';

import {User} from '../../interfaces/user';
import {TabsComponent} from '../atoms/Tabs';
import {useStyles} from './UserMenu.styles';
import {useUserTabs, UserMenuTabs} from './hooks/user-tabs.hooks';

type UserMenuProps = {
  selected: UserMenuTabs;
  anonymous?: boolean;
  user?: User;
};

export const UserMenu: React.FC<UserMenuProps> = props => {
  const {selected} = props;

  const styles = useStyles();

  const tabs = useUserTabs();
  const [activeTab, setActiveTab] = useState<UserMenuTabs>(selected);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as UserMenuTabs);
  };

  return (
    <Paper square className={styles.root}>
      <TabsComponent
        tabs={tabs}
        active={activeTab}
        onChangeTab={handleTabChange}
        size="small"
        padding={0}
      />
    </Paper>
  );
};
