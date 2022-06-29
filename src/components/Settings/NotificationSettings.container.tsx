import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {NotificationSettings} from './NotificationSettings';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {NotificationSettingItems} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {fetchNotificationSetting} from 'src/reducers/config/actions';
import {updateNotificationSetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const NotificationSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  React.useEffect(() => {
    user && dispatch(fetchNotificationSetting(user.id));
  }, []);

  const handleSave = (newSettings: NotificationSettingItems) => {
    dispatch(
      updateNotificationSetting(user?.id, newSettings, () => {
        enqueueSnackbar({
          message: 'New notification setting applied',
          variant: 'success',
        });
      }),
    );
  };

  return <NotificationSettings value={settings.notification} onSaveSetting={handleSave} />;
};
