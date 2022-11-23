import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {useMediaQuery, useTheme} from '@material-ui/core';
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

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const styles = useStyles();
  const tabs = useUserTabs(excludes);
  const tab = router.query.tab as string;

  const [activeTab, setActiveTab] = useState<UserMenuTabs>(selected);

  useEffect(() => {
    setActiveTab(selected);
  }, [profileDetail?.id]);

  useEffect(() => {
    if (tab === 'experience') {
      setActiveTab(tab as UserMenuTabs);
      router.replace({pathname: `/profile/${profileDetail.id}`, query: {}}, undefined, {
        shallow: true,
      });
    }
  }, [router.query]);

  return (
    <Paper square className={styles.root}>
      <TabsComponent<UserMenuTabs>
        tabs={tabs}
        selected={activeTab}
        scrollButtons="auto"
        variant="scrollable"
        onChangeTab={setActiveTab}
        size="small"
        background={'#FFFFFF'}
        position={isMobile ? 'left' : 'space-evenly'}
      />
    </Paper>
  );
};
