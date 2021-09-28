import React from 'react';

import {SocialMediaList as SocialMediaListComponent} from '.';
import {SocialMediaList} from './SocialMedia.stories';

export const SocialMediaListContainer: React.FC = () => {
  return (
    <SocialMediaListComponent
      connected={SocialMediaList.args?.connected ?? []}
      toggleVerify={social => console.log(social)}
    />
  );
};
