import React from 'react';

import {useTheme} from '@material-ui/core/styles';

import {Menu as MenuComponent} from '../../Menu/';
import {SidebarMenu} from '../../Menu/Menu.stories';
import {ProfileHeaderComponent} from '../../Profile/ProfileHeader';
import {Header, user} from '../../Profile/ProfileHeader/profile-header.stories';
import {user as userData} from '../../Profile/ProfileHeader/profile-header.stories';
import {ProfileHeader as ProfileHeaderHomeComponent} from '../../ProfileHeader';
import {RightMenuBar} from '../../RightMenuBar/RightMenuBar';
import {SocialMediaList} from '../../SocialMediaList/SocialMedia.stories';
import {UserMenu} from '../../UserMenu/';
import {UserMenu as UserMenuProps} from '../../UserMenu/UserMenu.stories';
import {WalletBalances} from '../../WalletBalance/WalletBalance.stories';
import {TopNavbarComponent, SectionTitle} from '../../atoms/TopNavbar';
import {ProfileTopNavbar} from '../../atoms/TopNavbar/TopNavbar.stories';
import useStyles from './profile-page.style';

const ProfilePage = (): JSX.Element => {
  const classes = useStyles();

  const theme = useTheme();

  return (
    <div className={classes.root}>
      <div className={classes.firstCol}>
        <div
          style={{
            maxWidth: 360,
            display: 'flex',
            flexDirection: 'column',
            rowGap: 12,
          }}>
          <div>
            <MenuComponent selected={'home'} onChange={SidebarMenu.args?.onChange ?? console.log} />
          </div>
          <div>
            <SocialMediaList
              connected={SocialMediaList.args?.connected ?? []}
              toggleVerify={social => console.log(social)}
            />
          </div>
          <div>
            <WalletBalances balances={WalletBalances.args?.balances ?? []} />
          </div>
        </div>
      </div>

      <div className={classes.secondCol}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'center',
            rowGap: 12,
          }}>
          <div style={{width: '100%'}}>
            <TopNavbarComponent
              sectionTitle={ProfileTopNavbar.args?.sectionTitle ?? SectionTitle.PROFILE}
              description={ProfileTopNavbar.args?.description ?? ''}
            />
          </div>
          <div style={{width: '100%'}}>
            <ProfileHeaderComponent
              user={Header.args?.user ?? user}
              selfProfile={true}
              status={null}
            />
          </div>
          <div style={{width: '100%'}}>
            <UserMenu
              selected={UserMenuProps.args?.selected ?? 'post'}
              anonymous={false}
              experiences={UserMenuProps.args?.experiences ?? []}
              socials={UserMenuProps.args?.socials ?? []}
              user={UserMenuProps.args?.user ?? user}
              friends={UserMenuProps.args?.friends ?? []}
            />
          </div>
        </div>
      </div>

      <div className={classes.thirdCol}>
        <div
          style={{
            maxWidth: 360,
            display: 'flex',
            flexDirection: 'column',
            rowGap: 12,
          }}>
          <div>
            <ProfileHeaderHomeComponent
              user={userData}
              handleSignOut={console.log}
              onViewProfile={console.log}
              onSwitchAccount={console.log}
            />
          </div>
          <div style={{marginTop: theme.spacing(2.5)}}>
            <RightMenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export {ProfilePage};
