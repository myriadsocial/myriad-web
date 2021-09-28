import React from 'react';

import {useTheme} from '@material-ui/core/styles';

import {MenuContainer} from '../../Menu/MenuContainer';
import {ProfileHeaderContainer} from '../../ProfileHeader/ProfileHeaderContainer';
import {RightMenuBar} from '../../RightMenuBar/RightMenuBar';
import {SocialMediaListContainer} from '../../SocialMediaList/SocialMediaListContainer';
import {WalletBalancesContainer} from '../../WalletBalance/WalletBalanceContainer';
import useStyles from './DefaultLayout.styles';

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
            <MenuContainer />
          </div>
          <div>
            <SocialMediaListContainer />
          </div>
          <div>
            <WalletBalancesContainer />
          </div>
        </div>
      </div>

      <div className={classes.secondCol}>
        <div className={classes.innerSecondColWrapper}>{children}</div>
      </div>

      <div className={classes.thirdCol}>
        <div className={classes.innerThirdColWrapper}>
          <div>
            <ProfileHeaderContainer />
          </div>
          <div style={{marginTop: theme.spacing(2.5)}}>
            <RightMenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};
