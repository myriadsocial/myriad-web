import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {AccountSettings} from './AccountSettings';

import {PrivacySettingType, PrivacyType} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updatePrivacySetting, fetchAccountSetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const AccountSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();

  React.useEffect(() => {
    user && dispatch(fetchAccountSetting(user.id));
  }, []);

  const handleSave = (key: PrivacySettingType, value: PrivacyType) => {
    dispatch(updatePrivacySetting(user?.id, key, value));
  };

  return <AccountSettings value={settings.privacy} onSaveSetting={handleSave} />;
};
