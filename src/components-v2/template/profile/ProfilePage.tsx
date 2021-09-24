import React from 'react';

import {useTheme} from '@material-ui/core/styles';

import {ExperienceList} from '../../ExperienceList/ExperienceList.stories';
import {Menu as MenuComponent} from '../../Menu/';
import {SidebarMenu} from '../../Menu/Menu.stories';
import {RightMenuBar} from '../../RightMenuBar/RightMenuBar';
import {SocialMediaList} from '../../SocialMediaList/SocialMedia.stories';
import {UserMenu} from '../../UserMenu/';
import {UserMenu as UserMenuProps} from '../../UserMenu/UserMenu.stories';
import {WalletBalances} from '../../WalletBalance/WalletBalance.stories';
import {TopNavbarComponent, SectionTitle} from '../../atoms/top-navbar/';
import {ProfileTopNavbar} from '../../atoms/top-navbar/TopNavbar.stories';
import {ProfileHeader as ProfileHeaderHomeComponent} from '../../profile-header/';
import {ProfileHeader as ProfileHeaderProps} from '../../profile-header/ProfileHeader.stories';
import {ProfileHeaderComponent} from '../../profile/profile-header/';
import {Header, user} from '../../profile/profile-header/profile-header.stories';
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
            <ProfileHeaderComponent user={Header.args?.user ?? user} />
          </div>
          <div style={{width: '100%'}}>
            <UserMenu
              selected={UserMenuProps.args?.selected ?? 'post'}
              anonymous={false}
              posts={UserMenuProps.args?.posts ?? []}
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
              name={ProfileHeaderProps.args?.name ?? 'Name'}
              username={ProfileHeaderProps.args?.username ?? 'Username'}
              avatar={
                ProfileHeaderProps.args?.avatar ??
                'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg'
              }
            />
          </div>
          <div style={{marginTop: theme.spacing(2.5)}}>
            <RightMenuBar experiences={ExperienceList.args?.experiences ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export {ProfilePage};
