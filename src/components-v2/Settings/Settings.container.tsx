import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Settings as SettingsComponent} from './Settings';
import {SettingsType} from './hooks/use-setting-list.hook';

import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

export const SettingsContainer: React.FC = () => {
  const router = useRouter();

  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const [currentSection, setCurrentSection] = useState<SettingsType | undefined>();

  useEffect(() => {
    const section = router.query.section as SettingsType | undefined;

    setCurrentSection(section);
  }, [router.query]);

  const handleChangeSection = (section: SettingsType) => {
    router.push(
      {
        pathname: '/settings',
        query: {section},
      },
      undefined,
      {shallow: true},
    );
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
