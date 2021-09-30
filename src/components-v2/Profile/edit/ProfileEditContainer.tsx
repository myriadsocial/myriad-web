import React from 'react';
import {useSelector} from 'react-redux';

import {ProfileEditComponent} from './ProfileEdit';

import {useProfileHook} from 'src/components/profile/use-profile.hook';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ProfileEditContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {uploadingAvatar, uploadingBanner, updateProfileBanner} = useProfileHook();

  const hanleUpdateBannerImage = async (image: File): Promise<void> => {
    updateProfileBanner(image);
  };

  const onSave = (newUser: Partial<User>) => {
    console.log(newUser);
  };

  return (
    <>
      {user && (
        <ProfileEditComponent
          user={user}
          onSave={onSave}
          uploadingAvatar={uploadingAvatar}
          uploadingBanner={uploadingBanner}
          updateProfileBanner={hanleUpdateBannerImage}
        />
      )}
    </>
  );
};
