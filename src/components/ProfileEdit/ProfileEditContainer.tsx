import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {ProfileEditComponent} from './ProfileEdit';

import {useProfileHook} from 'src/hooks/use-profile.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  onClose: () => void;
};

export const ProfileEditContainer: React.FC<Props> = ({onClose}) => {
  const router = useRouter();
  const confirm = useConfirm();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [profilePic, setProfilePic] = React.useState<File | undefined | string>(
    user?.profilePictureURL,
  );
  const [bannerPic, setBannerPic] = React.useState<File | undefined | string>(user?.bannerImageUrl);
  const {
    updateProfile,
    loadingUpdate,
    uploadingAvatar,
    uploadingBanner,
    updateProfileBanner,
    updateProfilePicture,
    checkUsernameStatus,
    checkUsernameAvailable,
    usernameStatus,
    usernameAvailable,
  } = useProfileHook();
  const {openToasterSnack} = useToasterSnackHook();

  useEffect(() => {
    checkUsernameStatus();
  }, []);

  const hanleUpdateBannerImage = async (image: File): Promise<void> => {
    setBannerPic(image);
  };

  const handleUpdateProfilePicture = (image: File | undefined): void => {
    setProfilePic(image);
  };

  const handleUsernameAvailable = (username: string): void => {
    checkUsernameAvailable(username);
  };

  const onSave = async (newUser: Partial<User>) => {
    newUser.profilePictureURL = '';

    try {
      if (profilePic instanceof File) {
        const newUrlProfilePic = await updateProfilePicture(profilePic);
        if (typeof newUrlProfilePic === 'string') {
          newUser.profilePictureURL = newUrlProfilePic;
          setProfilePic(newUrlProfilePic);
        }
      }

      if (bannerPic instanceof File) {
        const newUrlBannerPic = await updateProfileBanner(bannerPic);
        if (typeof newUrlBannerPic === 'string') {
          newUser.bannerImageUrl = newUrlBannerPic;
        }
      }

      updateProfile(newUser, openSuccesPrompt);
    } catch (err) {
      openToasterSnack({
        message: 'something went wrong!',
        variant: 'error',
      });
    }
  };

  const redirectToProfile = () => {
    router.push(
      {
        pathname: `/profile/${user?.id}`,
      },
      undefined,
      {shallow: true},
    );
  };

  const openSuccesPrompt = useCallback(() => {
    confirm({
      title: 'Profile saved!',
      description: 'You have saved your changes.',
      icon: 'success',
      confirmationText: 'See Profile',
      hideCancel: true,
      onConfirm: () => {
        redirectToProfile();
      },
    });
  }, [redirectToProfile, user]);

  if (!user) return null;

  return (
    <>
      <ProfileEditComponent
        user={user}
        imageProfile={profilePic}
        imageBanner={bannerPic}
        onSave={onSave}
        updatingProfile={loadingUpdate}
        uploadingAvatar={uploadingAvatar}
        uploadingBanner={uploadingBanner}
        updateProfileBanner={hanleUpdateBannerImage}
        updateProfilePicture={handleUpdateProfilePicture}
        isChanged={usernameStatus}
        checkAvailable={handleUsernameAvailable}
        isAvailable={usernameAvailable}
        onCancel={redirectToProfile}
      />
    </>
  );
};

export default ProfileEditContainer;
