import React, {useState} from 'react';

import {useTheme} from '@material-ui/core/styles';

import {MenuContainer} from '../../Menu/MenuContainer';
import {NotificationsContainer} from '../../Notifications/sidebar/Notifications.container';
import {ProfileHeaderContainer} from '../../ProfileHeader/ProfileHeaderContainer';
import {RightMenuBar} from '../../RightMenuBar/RightMenuBar';
import {SocialMediaListContainer} from '../../SocialMediaList/SocialMediaListContainer';
import {WalletBalancesContainer} from '../../WalletBalance/WalletBalanceContainer';
import useStyles from './DefaultLayout.styles';

import {withError, WithErrorProps} from 'src/components-v2/Error';
import ShowIf from 'src/components/common/show-if.component';

type DefaultLayoutProps = WithErrorProps & {
  isOnProfilePage: boolean;
  children: React.ReactNode;
};

const Default: React.FC<DefaultLayoutProps> = props => {
  const {children} = props;
  const classes = useStyles();
  const [showNotification, setShowNotification] = useState(false);
  const theme = useTheme();

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <>
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
              <ProfileHeaderContainer toggleNotification={handleToggleNotification} />
            </div>
            <div style={{marginTop: theme.spacing(1)}}>
              <ShowIf condition={!showNotification}>
                <RightMenuBar />
              </ShowIf>
              <ShowIf condition={showNotification}>
                <NotificationsContainer />
              </ShowIf>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const DefaultLayout = withError(Default);
