import React from 'react';

import {Empty} from '../atoms/Empty';

import i18n from 'src/locale';

export const PrivateProfile: React.FC = () => {
  return (
    <div style={{marginTop: '27px'}}>
      <Empty
        title={i18n.t('Profile.Private.Title')}
        subtitle={i18n.t('Profile.Private.Subtitle')}
      />
    </div>
  );
};
