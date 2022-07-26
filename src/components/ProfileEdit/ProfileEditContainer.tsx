import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {ProfileEditComponent} from './ProfileEdit';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {useProfileHook} from 'src/hooks/use-profile.hook';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
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
  const [bannerPic, setBannerPic] = React.useState<File | undefined | string>(user?.bannerImageURL);
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
  const enqueueSnackbar = useEnqueueSnackbar();

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
          newUser.bannerImageURL = newUrlBannerPic;
        }
      }

      updateProfile(newUser, openSuccesPrompt);
    } catch (err) {
      enqueueSnackbar({
        message: i18n.t('Profile.Edit.Alert'),
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
      title: i18n.t('Profile.Edit.Prompt.Title'),
      description: i18n.t('Profile.Edit.Prompt.Desc'),
      icon: 'success',
      confirmationText: i18n.t('Profile.Edit.Prompt.Btn'),
      hideCancel: true,
      onConfirm: () => {
        redirectToProfile();
      },
    });
  }, [redirectToProfile, user]);

  const getImageBannerString = () => {
    return bannerPic instanceof File ? URL.createObjectURL(bannerPic) : user.bannerImageURL;
  };

  if (!user) return null;

  return (
    <>
      <ProfileEditComponent
        user={user}
        imageProfile={profilePic}
        imageBanner={getImageBannerString()}
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
