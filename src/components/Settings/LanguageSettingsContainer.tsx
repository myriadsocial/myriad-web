import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {LanguageSetting} from './LanguageSetting';

import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {LanguageSettingType} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updateLanguageSetting, fetchLanguageSetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const LanguageSettingsContainer: React.FC = () => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [langValue, setLangValue] = React.useState(settings.language);

  React.useEffect(() => {
    user && dispatch(fetchLanguageSetting(user.id));
  }, []);

  React.useEffect(() => {
    const langStorage = localStorage.getItem('i18nextLng');
    console.log(langStorage);
    if (langStorage) {
      setLangValue(langStorage as LanguageSettingType);
    } else {
      setLangValue(settings.language);
    }
  }, [settings]);

  const handleSave = (payload: LanguageSettingType) => {
    localStorage.setItem('i18nextLng', payload);
    dispatch(updateLanguageSetting(user?.id, payload));
    // dispatch(
    //   updateLanguageSetting(user?.id, payload, () => {
    //     openPrompt();
    //   }),
    // );
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
      <LanguageSetting value={langValue} onSaveSetting={handleSave} />
      <PromptComponent
        title="Success!"
        subtitle={<Typography>New language setting applied</Typography>}
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
