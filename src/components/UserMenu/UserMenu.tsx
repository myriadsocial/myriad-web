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
  excludes?: UserMenuTabs[];
};

export const UserMenu: React.FC<UserMenuProps> = props => {
  const {selected, excludes = []} = props;
  const {detail: profileDetail} = useSelector<RootState, ProfileState>(state => state.profileState);

  const styles = useStyles();
  const tabs = useUserTabs(excludes);

  const [activeTab, setActiveTab] = useState<UserMenuTabs>(selected);

  useEffect(() => {
    setActiveTab(selected);
  }, [profileDetail?.id]);

  return (
    <Paper square className={styles.root}>
      <TabsComponent<UserMenuTabs>
        tabs={tabs}
        selected={activeTab}
        onChangeTab={setActiveTab}
        size="small"
        background={'#FFFFFF'}
      />
    </Paper>
  );
};
