import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {AccountSettings} from './AccountSettings';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {PrivacySettings} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updatePrivacySetting, fetchAccountPrivacySetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const AccountSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();
  const {openToasterSnack} = useToasterSnackHook();

  React.useEffect(() => {
    user && dispatch(fetchAccountPrivacySetting(user.id));
  }, []);

  const handleSave = (payload: PrivacySettings) => {
    dispatch(
      updatePrivacySetting(user?.id, payload, () => {
        openToasterSnack({
          message: 'New privacy setting applied',
          variant: 'success',
        });
      }),
    );
  };

  return <AccountSettings value={settings.privacy} onSaveSetting={handleSave} />;
};
