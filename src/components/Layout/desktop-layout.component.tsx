import React, {useEffect} from 'react';

import AppBar from '../app-bar/app-bar.component';
import ShowIf from '../common/show-if.component';
import SidebarComponent from '../sidebar/sidebar.component';
import {useStyles} from './layout.style';

import BannerDemo from 'src/components/common/banner-demo.component';
import {NotifProvider} from 'src/context/notif.context';
import {useLayout} from 'src/hooks/use-layout.hook';
import {useUserHook} from 'src/hooks/use-user.hook';
import {ExtendedUser} from 'src/interfaces/user';

type Props = {
  children: React.ReactNode;
  user: ExtendedUser;
};

const DesktopLayoutComponent = ({children, user}: Props) => {
  const style = useStyles();
  const {setting} = useLayout();

  const {loadFcmToken} = useUserHook();

  useEffect(() => {
    // TODO: this should be only loaded once on layout container
    if (!user.anonymous) {
      loadFcmToken();
    }

    return undefined;
  }, []);

  return (
    <>
      <NotifProvider>
        <AppBar />
        <BannerDemo />

        <div className={style.appWrapper}>
          <div className={style.contentWrapper}>{children}</div>

          <div className={style.experience}>
            <ShowIf condition={!setting.focus}>
              <SidebarComponent isAnonymous={user.anonymous} />
            </ShowIf>
          </div>
        </div>
      </NotifProvider>
    </>
  );
};

export default DesktopLayoutComponent;
