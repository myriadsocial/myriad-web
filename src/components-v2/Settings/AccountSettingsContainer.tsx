import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {AccountSettings} from './AccountSettings';

import {PrivacySettingType, PrivacyType} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updatePrivacySetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';

export const AccountSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const dispatch = useDispatch();

  const handleSave = (key: PrivacySettingType, value: PrivacyType) => {
    dispatch(updatePrivacySetting(key, value));
  };

  return <AccountSettings value={settings.privacy} onSaveSetting={handleSave} />;
};
