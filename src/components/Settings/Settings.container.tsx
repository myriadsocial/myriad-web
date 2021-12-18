import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {Settings as SettingsComponent} from './Settings';
import {SettingsType} from './hooks/use-setting-list.hook';

import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

const {publicRuntimeConfig} = getConfig();

export const SettingsContainer: React.FC = () => {
  const router = useRouter();

  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const [currentSection, setCurrentSection] = useState<SettingsType | undefined>();

  useEffect(() => {
    const section = router.query.section as SettingsType | undefined;

    setCurrentSection(section);
  }, [router.query]);

  const handleChangeSection = (section: SettingsType) => {
    if (section === 'about') {
      window.open(publicRuntimeConfig.myriadWebsiteURL, '_ blank');
    } else {
      router.push(
        {
          pathname: '/settings',
          query: {section},
        },
        undefined,
        {shallow: true},
      );
    }
  };

  return (
    <SettingsComponent
      value={settings}
      selectedType={currentSection}
      onChange={handleChangeSection}
      onSaveSetting={console.log}
    />
  );
};
