import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import Typography from '@material-ui/core/Typography';

import Notification from './notif-list.component';

import ShowIf from 'src/components/common/show-if.component';
import {useNotifHook} from 'src/hooks/use-notif.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

interface NotificationProps {
  title?: string;
}

const NotificationComponent: React.FC<NotificationProps> = () => {
  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {loadNotifications} = useNotifHook();

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div style={{padding: 8}}>
      <div style={{paddingTop: 16, paddingBottom: 8}}>
        <Typography variant="h4" style={{marginBottom: 16}}>
          {'Notification'}
        </Typography>

        <ShowIf condition={anonymous}>
          <Typography
            variant="h5"
            color="textPrimary"
            style={{textAlign: 'center', padding: '16px 40px'}}>
            {"You don't have any notifications, create account to receive notification."}
          </Typography>
        </ShowIf>

        <ShowIf condition={!anonymous}>
          <Notification />
        </ShowIf>
      </div>
    </div>
  );
};

export default NotificationComponent;
