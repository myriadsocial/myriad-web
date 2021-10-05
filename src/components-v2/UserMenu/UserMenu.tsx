import React, {useState} from 'react';

import Paper from '@material-ui/core/Paper';

import {Experience} from '../../interfaces/experience';
import {Friend} from '../../interfaces/friend';
import {SocialMedia} from '../../interfaces/social';
import {User} from '../../interfaces/user';
import {TabsComponent} from '../atoms/Tabs';
import {useStyles} from './UserMenu.styles';
import {useUserTabs, UserMenuTabs} from './hooks/user-tabs.hooks';

type UserMenuProps = {
  selected: UserMenuTabs;
  anonymous?: boolean;
  experiences?: Experience[];
  socials?: SocialMedia[];
  user?: User;
  friends?: Friend[];
};

export const UserMenu: React.FC<UserMenuProps> = props => {
  const {selected, user, experiences = [], socials = [], friends = []} = props;

  const styles = useStyles();

  const tabs = useUserTabs({experiences, user, socials, friends});
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
