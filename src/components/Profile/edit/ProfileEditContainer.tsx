import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {PromptComponent} from '../../atoms/Prompt/prompt.component';
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
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [open, setOpen] = React.useState(false);
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
    try {
      if (profilePic instanceof File) {
        const newUrlProfilePic = await updateProfilePicture(profilePic);
        if (typeof newUrlProfilePic === 'string') {
          newUser.profilePictureURL = newUrlProfilePic;
          setProfilePic(newUrlProfilePic);
        }
      } else if (profilePic === undefined) {
        newUser.profilePictureURL = '';
      }
      if (bannerPic instanceof File) {
        const newUrlBannerPic = await updateProfileBanner(bannerPic);
        if (typeof newUrlBannerPic === 'string') {
          newUser.bannerImageUrl = newUrlBannerPic;
        }
      }
      updateProfile(newUser, () => {
        openPrompt();
      });
    } catch (err) {
      console.log(err);
      openToasterSnack({
        message: 'something went wrong!',
        variant: 'error',
      });
    }
  };

  const finishedEditProfile = () => {
    onClose();
    handleCloseEdit();
  };

  const handleCloseEdit = () => {
    router.push(
      {
        pathname: `/profile/${user?.id}`,
      },
      undefined,
      {shallow: true},
    );
  };

  const openPrompt = () => {
    setOpen(!open);
  };

  return (
    <>
      {user && (
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
          onCancel={finishedEditProfile}
        />
      )}
      <PromptComponent
        title="Profile saved!"
        subtitle={<Typography>You have saved your changes.</Typography>}
        icon="success"
        open={open}
        onCancel={openPrompt}>
        <Button size="small" variant="contained" color="primary" onClick={finishedEditProfile}>
          See Profile
        </Button>
      </PromptComponent>
    </>
  );
};
