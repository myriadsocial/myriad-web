import React from 'react';

import {ProfileHeader as ProfileHeaderComponent} from '.';
import {ProfileHeader} from './ProfileHeader.stories';

export const ProfileHeaderContainer: React.FC = () => {
  return (
    <ProfileHeaderComponent
      name={ProfileHeader.args?.name ?? 'Name'}
      username={ProfileHeader.args?.username ?? 'Username'}
      avatar={
        ProfileHeader.args?.avatar ??
        'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg'
      }
    />
  );
};
