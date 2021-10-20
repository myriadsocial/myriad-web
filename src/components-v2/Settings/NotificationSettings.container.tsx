import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {NotificationSettings} from './NotificationSettings';

import {NotificationSettingItems} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updateNotificationSetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';

export const NotificationSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSave = (settings: NotificationSettingItems) => {
    dispatch(updateNotificationSetting(settings));

    router.push(
      {
        pathname: '/settings',
      },
      undefined,
      {shallow: true},
    );
  };

  return <NotificationSettings value={settings.notification} onSaveSetting={handleSave} />;
};
