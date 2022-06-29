import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {AccountSettings} from './AccountSettings';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {PrivacySettings} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updatePrivacySetting, fetchAccountPrivacySetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const AccountSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  React.useEffect(() => {
    user && dispatch(fetchAccountPrivacySetting(user.id));
  }, []);

  const handleSave = (payload: PrivacySettings) => {
    dispatch(
      updatePrivacySetting(user?.id, payload, () => {
        enqueueSnackbar({
          message: 'New privacy setting applied',
          variant: 'success',
        });
      }),
    );
  };

  return <AccountSettings value={settings.privacy} onSaveSetting={handleSave} />;
};
