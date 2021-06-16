import React from 'react';

import Typography from '@material-ui/core/Typography';

import Notification from './notif-list.component';

import ShowIf from 'src/components/common/show-if.component';
import { useUser } from 'src/context/user.context';

interface NotifProps {
  title?: string;
  isAnonymous: boolean;
}

const NotificationComponent: React.FC<NotifProps> = ({ isAnonymous }) => {
  const { state } = useUser();

  if (!isAnonymous && !state.user) return null;

  return (
    <div style={{ padding: 8 }}>
      <div style={{ paddingTop: 16, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          {'Notification'}
        </Typography>

        <ShowIf condition={isAnonymous}>
          <Typography variant="h5" color="textPrimary" style={{ textAlign: 'center', padding: '16px 40px' }}>
            You don't have any notifications, create account to receive notification.
          </Typography>
        </ShowIf>

        {state.user && <Notification user={state.user} />}
      </div>
    </div>
  );
};

export default NotificationComponent;
