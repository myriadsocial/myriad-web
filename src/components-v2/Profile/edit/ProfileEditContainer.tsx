import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {PromptComponent} from '../../atoms/Prompt/prompt.component';
import {ProfileEditComponent} from './ProfileEdit';

import {useProfileHook} from 'src/hooks/use-profile.hook';
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
  const {
    updateProfile,
    loading,
    uploadingAvatar,
    uploadingBanner,
    updateProfileBanner,
    updateProfilePicture,
    checkUsernameStatus,
    checkUsernameAvailable,
    usernameStatus,
    usernameAvailable,
  } = useProfileHook();

  useEffect(() => {
    checkUsernameStatus();
  }, []);

  const hanleUpdateBannerImage = async (image: File): Promise<void> => {
    updateProfileBanner(image);
  };

  const handleUpdateProfilePicture = (image: File): void => {
    updateProfilePicture(image);
  };

  const handleUsernameAvailable = (username: string): void => {
    checkUsernameAvailable(username);
  };

  const onSave = (newUser: Partial<User>) => {
    updateProfile(newUser, () => {
      openPrompt();
    });
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
          onSave={onSave}
          updatingProfile={loading}
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
        subtitle={<Typography>Your profile changes has saved</Typography>}
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
