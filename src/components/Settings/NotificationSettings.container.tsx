import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {NotificationSettings} from './NotificationSettings';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
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
  const {openToasterSnack} = useToasterSnackHook();

  React.useEffect(() => {
    user && dispatch(fetchNotificationSetting(user.id));
  }, []);

  const handleSave = (newSettings: NotificationSettingItems) => {
    dispatch(
      updateNotificationSetting(user?.id, newSettings, () => {
        openToasterSnack({
          message: 'New notification setting applied',
          variant: 'success',
        });
      }),
    );
  };

  return <NotificationSettings value={settings.notification} onSaveSetting={handleSave} />;
};
