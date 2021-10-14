import React from 'react';
import {useSelector} from 'react-redux';

import {ProfileEditComponent} from './ProfileEdit';

import {useProfileHook} from 'src/components/profile/use-profile.hook';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  onClose: () => void;
};

export const ProfileEditContainer: React.FC<Props> = ({onClose}) => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {
    updateProfile,
    loading,
    uploadingAvatar,
    uploadingBanner,
    updateProfileBanner,
    updateProfilePicture,
  } = useProfileHook();

  const hanleUpdateBannerImage = async (image: File): Promise<void> => {
    updateProfileBanner(image);
  };

  const handleUpdateProfilePicture = (image: File): void => {
    updateProfilePicture(image);
  };

  const onSave = (newUser: Partial<User>) => {
    updateProfile(newUser);
    onClose();
  };

  return (
    <>
      {user && (
        <ProfileEditComponent
          user={user}
          onSave={onSave}
          updatingProfile={loading}
          uploadingAvatar={uploadingAvatar}
          uploadingBanner={uploadingBanner}
          updateProfileBanner={hanleUpdateBannerImage}
          updateProfilePicture={handleUpdateProfilePicture}
        />
      )}
    </>
  );
};
