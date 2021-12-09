import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {AccountSettings} from './AccountSettings';

import {PromptComponent} from 'src/components-v2/atoms/Prompt/prompt.component';
import {PrivacySettings} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updatePrivacySetting, fetchAccountPrivacySetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const AccountSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    user && dispatch(fetchAccountPrivacySetting(user.id));
  }, []);

  const handleSave = (payload: PrivacySettings) => {
    dispatch(
      updatePrivacySetting(user?.id, payload, () => {
        openPrompt();
      }),
    );
  };

  const openPrompt = () => {
    setOpen(!open);
  };

  const handleGoHome = () => {
    openPrompt();
    router.push(
      {
        pathname: '/home',
      },
      undefined,
      {shallow: true},
    );
  };

  const handleGoSetting = () => {
    openPrompt();
    router.push(
      {
        pathname: '/settings',
      },
      undefined,
      {shallow: true},
    );
  };

  return (
    <>
      <AccountSettings value={settings.privacy} onSaveSetting={handleSave} />
      <PromptComponent
        title="Success!"
        subtitle={<Typography>New privacy setting applied</Typography>}
        icon="success"
        open={open}
        onCancel={openPrompt}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button
            style={{marginRight: 12}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleGoSetting}>
            Setting
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={handleGoHome}>
            Back to Home
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
