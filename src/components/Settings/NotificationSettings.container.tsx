import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {NotificationSettings} from './NotificationSettings';

import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
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
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    user && dispatch(fetchNotificationSetting(user.id));
  }, []);

  const handleSave = (newSettings: NotificationSettingItems) => {
    dispatch(
      updateNotificationSetting(user?.id, newSettings, () => {
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
      <NotificationSettings value={settings.notification} onSaveSetting={handleSave} />
      <PromptComponent
        title="Success!"
        subtitle={<Typography>New notification setting applied</Typography>}
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
