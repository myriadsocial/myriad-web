import React from 'react';

import {Empty} from '../atoms/Empty';
import ShowIf from '../common/show-if.component';

import i18n from 'src/locale';

type EmptyPostProps = {
  owner: boolean;
};

export const EmptyProfilePost: React.FC<EmptyPostProps> = ({owner}) => {
  return (
    <div style={{marginTop: 30}}>
      <ShowIf condition={owner}>
        <Empty
          title={i18n.t('Profile.Empty.Title_Own')}
          subtitle={i18n.t('Profile.Empty.Subtitle_Own')}
        />
      </ShowIf>

      <ShowIf condition={!owner}>
        <Empty title={i18n.t('Profile.Empty.Title')} subtitle={i18n.t('Profile.Empty.Subtitle')} />
      </ShowIf>
    </div>
  );
};
