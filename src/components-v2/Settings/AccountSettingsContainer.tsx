import React from 'react';

import {AccountSettings} from './AccountSettings';

export const AccountSettingsContainer: React.FC = () => {
  const handleOnSave = () => {
    console.log('saved');
  };

  return <AccountSettings onSaveSetting={handleOnSave} />;
};
