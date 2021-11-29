import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import Paper from '@material-ui/core/Paper';

import {User} from '../../interfaces/user';
import {TabsComponent} from '../atoms/Tabs';
import {useStyles} from './UserMenu.styles';
import {useUserTabs, UserMenuTabs} from './hooks/user-tabs.hooks';

import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';

type UserMenuProps = {
  selected: UserMenuTabs;
  anonymous?: boolean;
  user?: User;
  isMyriad?: boolean;
};

export const UserMenu: React.FC<UserMenuProps> = props => {
  const {selected, isMyriad} = props;
  const {detail: profileDetail} = useSelector<RootState, ProfileState>(state => state.profileState);

  const styles = useStyles();

  const tabs = isMyriad ? useUserTabs().filter(tab => tab.id !== 'friend') : useUserTabs();
  const [activeTab, setActiveTab] = useState<UserMenuTabs>(selected);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as UserMenuTabs);
  };

  useEffect(() => {
    setActiveTab(selected);
  }, [profileDetail?.id]);

  return (
    <Paper square className={styles.root}>
      <TabsComponent
        tabs={tabs}
        active={activeTab}
        onChangeTab={handleTabChange}
        size="small"
        paddingLeft={30}
        paddingRight={30}
      />
    </Paper>
  );
};
