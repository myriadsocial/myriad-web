import React from 'react';

import Typography from '@material-ui/core/Typography';

import Notification from './notif-list.component';

import { useUser } from 'src/components/user/user.context';

interface NotifProps {
  title?: string;
}

const NotificationComponent: React.FC<NotifProps> = props => {
  const { state } = useUser();

  if (!state.user) return null;

  return (
    <div style={{ padding: 8 }}>
      <div style={{ paddingTop: 16, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          {'Notification'}
        </Typography>
        <Notification user={state.user} />
      </div>
    </div>
  );
};

export default NotificationComponent;
