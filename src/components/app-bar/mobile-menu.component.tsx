import React from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import HomeIcon from '@material-ui/icons/Home';
import LanguageIcon from '@material-ui/icons/Language';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';

import {useLayout} from 'src/hooks/use-layout.hook';
import {SidebarTab} from 'src/interfaces/sidebar';

interface MonileMenuProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
);

const MobileMenuComponent: React.FC<MonileMenuProps> = () => {
  const styles = useStyles();

  const {changeSelectedSidebar} = useLayout();
  const [value, setValue] = React.useState(4);

  const handleChange = (event: React.ChangeEvent<{}>, tab: SidebarTab) => {
    setValue(tab);
    changeSelectedSidebar(tab);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} className={styles.root}>
      <BottomNavigationAction label="Home" value={SidebarTab.HOME} icon={<HomeIcon />} />
      <BottomNavigationAction
        label="Wallet"
        value={SidebarTab.WALLET}
        icon={<AccountBalanceWalletIcon />}
      />
      <BottomNavigationAction label="Topics" value={SidebarTab.TRENDING} icon={<LanguageIcon />} />
      <BottomNavigationAction label="Friends" value={SidebarTab.FRIENDS} icon={<PeopleIcon />} />
      <BottomNavigationAction
        label="Notifications"
        value={SidebarTab.NOTIFICATION}
        icon={<NotificationsIcon />}
      />
    </BottomNavigation>
  );
};

export default MobileMenuComponent;
