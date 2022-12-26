import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {LanguageSetting} from './LanguageSetting';

import {LanguageSettingType} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {updateLanguageSetting, fetchLanguageSetting} from 'src/reducers/config/actions';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const LanguageSettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const confirm = useConfirm();

  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [langValue, setLangValue] = React.useState(settings.language);

  React.useEffect(() => {
    user && dispatch(fetchLanguageSetting(user.id));
  }, [user]);

  React.useEffect(() => {
    const langStorage = localStorage.getItem('i18nextLng');

    if (langStorage) {
      setLangValue(langStorage as LanguageSettingType);
    } else {
      setLangValue(settings.language);
    }
  }, [settings]);

  const handleSave = (payload: LanguageSettingType) => {
    localStorage.setItem('i18nextLng', payload);

    dispatch(updateLanguageSetting(user?.id, payload));

    confirm({
      title: 'Success!',
      description: 'New language setting applied',
      icon: 'success',
      confirmationText: 'Back Home',
      cancellationText: 'Setting',
      onConfirm: () => {
        router.push(
          {
            pathname: '/',
          },
          undefined,
          {shallow: true},
        );
      },
      onCancel: () => {
        router.push(
          {
            pathname: '/settings',
          },
          undefined,
          {shallow: true},
        );
      },
    });
  };

  return (
    <>
      <LanguageSetting value={langValue} onSaveSetting={handleSave} />
    </>
  );
};
