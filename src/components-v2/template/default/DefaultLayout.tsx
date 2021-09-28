import React from 'react';

import {useTheme} from '@material-ui/core/styles';

import {Menu as MenuComponent} from '../../Menu/';
import {SidebarMenu} from '../../Menu/Menu.stories';
import {RightMenuBar} from '../../RightMenuBar/RightMenuBar';
import {SocialMediaList} from '../../SocialMediaList/SocialMedia.stories';
import {WalletBalances} from '../../WalletBalance/WalletBalance.stories';
import {ProfileHeader as ProfileHeaderComponent} from '../../profile-header/';
import {ProfileHeader} from '../../profile-header/ProfileHeader.stories';
import useStyles from './default-layout.styles';

type DefaultLayoutProps = {
  isOnProfilePage: boolean;
  children: React.ReactNode;
};

export const DefaultLayout: React.FC<DefaultLayoutProps> = props => {
  const {isOnProfilePage, children} = props;
  const classes = useStyles();

  const theme = useTheme();

  console.log({isOnProfilePage});

  return (
    <div className={classes.root}>
      <div className={classes.firstCol}>
        <div className={classes.innerFirstColWrapper}>
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
        <div className={classes.innerSecondColWrapper}>{children}</div>
      </div>

      <div className={classes.thirdCol}>
        <div className={classes.innerThirdColWrapper}>
          <div>
            <ProfileHeaderComponent
              name={ProfileHeader.args?.name ?? 'Name'}
              username={ProfileHeader.args?.username ?? 'Username'}
              avatar={
                ProfileHeader.args?.avatar ??
                'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg'
              }
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
