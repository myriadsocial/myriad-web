import React from 'react';

import {useRouter} from 'next/router';

import {SocialMediaList as SocialMediaListComponent} from '.';
import {SocialMediaList} from './SocialMedia.stories';

export const SocialMediaListContainer: React.FC = () => {
  const router = useRouter();

  const handleOpenSocialPage = () => {
    router.push(`/user/socials`);
  };

  return (
    <SocialMediaListComponent
      connected={SocialMediaList.args?.connected ?? []}
      toggleVerify={social => console.log(social)}
      openSocialPage={handleOpenSocialPage}
    />
  );
};
