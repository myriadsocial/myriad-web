import React from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import HomeIcon from '@material-ui/icons/Home';
import LanguageIcon from '@material-ui/icons/Language';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';

import { SidebarTab } from 'src/interfaces/sidebar';

interface Props {
  onChange: (menu: SidebarTab) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
  })
);

export const MobileMenuComponent = ({ onChange }: Props) => {
  const styles = useStyles();

  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} className={styles.root}>
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Wallet" icon={<AccountBalanceWalletIcon />} />
      <BottomNavigationAction label="Topics" value={SidebarTab.TRENDING} icon={<LanguageIcon />} />
      <BottomNavigationAction label="Friends" value={SidebarTab.FRIENDS} icon={<PeopleIcon />} />
      <BottomNavigationAction label="Notifications" value={SidebarTab.NOTIFICATION} icon={<NotificationsIcon />} />
    </BottomNavigation>
  );
};
