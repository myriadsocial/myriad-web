import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {FormControl, OutlinedInput} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';

import {User} from '../../../interfaces/user';
import {IconButtonUpload} from './IconButtonUpload.component';
import {ImageButton} from './ImageButton.component';
import {useStyles} from './profile-edit.style';

import {debounce} from 'lodash';

export type Props = {
  user: User;
  onSave: (user: Partial<User>) => void;
  uploadingAvatar: boolean;
  uploadingBanner: boolean;
  updatingProfile: boolean;
  isChanged: boolean;
  isAvailable?: boolean;
  updateProfileBanner: (image: File) => void;
  updateProfilePicture: (image: File) => void;
  checkAvailable: (username: string) => void;
};

export const ProfileEditComponent: React.FC<Props> = props => {
  const {
    user,
    onSave,
    updatingProfile,
    uploadingBanner,
    updateProfileBanner,
    uploadingAvatar,
    updateProfilePicture,
    isChanged,
    isAvailable,
    checkAvailable,
  } = props;
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: user.name ?? '',
    bio: user.bio ?? '',
    websiteURL: user.websiteURL ?? '',
  });

  const [username, setUsername] = useState<string>(user.username ?? '');

  const style = useStyles();

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    handleUsernameAvailable(event.target.value);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(prevUser => ({
      ...prevUser,
      [field]: event.target.value,
    }));
  };

  const saveUser = async () => {
    if (!isChanged && isAvailable && username !== user.username) {
      onSave({...newUser, username});
    } else {
      if (newUser) {
        onSave(newUser);
      }
    }
  };

  const handleUsernameAvailable = debounce((username: string) => {
    if (username !== user.username) {
      checkAvailable(username);
    }
  }, 300);

  const handleRemovePicture = (image: Partial<User>) => {
    onSave(image);
  };

  const hanleUpdateBannerImage = (image: File): void => {
    updateProfileBanner(image);
  };

  const handleUpdateProfilePicture = (image: File): void => {
    updateProfilePicture(image);
  };

  const handleError = (): boolean => {
    if (!username.length) return true;
    if (isAvailable === undefined) return false;
    if (typeof isAvailable === 'boolean') {
      if (isAvailable === true) return false;
      if (isAvailable === false) return true;
    }
    return false;
  };

  return (
    <div className={style.root}>
      <Typography className={style.title}>Edit Profile</Typography>

      <FormControl fullWidth variant="outlined" focused>
        <InputLabel htmlFor="profile-picture" shrink={true} className={style.label}>
          Profile Picture
        </InputLabel>
        <div className={style.pictureBox}>
          <div className={style.box}>
            <Avatar
              alt={user.name}
              src={user.profilePictureURL}
              variant="circle"
              className={style.avatar}
            />
            <ImageButton
              title="Edit Image profile"
              onImageSelected={handleUpdateProfilePicture}
              removePicture={handleRemovePicture}
              loading={uploadingAvatar}
              accept="image"
            />
          </div>
        </div>
      </FormControl>

      <FormControl fullWidth variant="outlined" focused>
        <InputLabel htmlFor="background-images" shrink={true} className={style.label}>
          Background Image
        </InputLabel>
        <div className={style.bgBox}>
          <CardMedia className={style.media} image={user.bannerImageUrl} title={user.name} />
          <IconButtonUpload
            title="Edit Banner Image"
            onImageSelected={hanleUpdateBannerImage}
            loading={uploadingBanner}
            accept="image"
          />
        </div>
      </FormControl>

      <FormControl className={style.username} fullWidth variant="outlined">
        <InputLabel htmlFor="username">Username</InputLabel>
        <OutlinedInput
          error={handleError()}
          disabled={isChanged}
          id="username"
          placeholder="Username"
          value={username}
          onChange={handleChangeUsername}
          labelWidth={80}
          startAdornment={'@'}
        />
      </FormControl>

      {username !== user.username && (
        <Typography className={`${style.available} ${handleError() ? style.red : style.green}`}>
          {handleError() ? 'Username is not available' : 'Username is available'}
        </Typography>
      )}

      <Typography className={style.marker}>
        {isChanged ? 'You already set username' : 'You have used the attempt to change your name'}
      </Typography>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="display-name">Display Name</InputLabel>
        <OutlinedInput
          id="display-name"
          placeholder="Display Name"
          value={newUser?.name}
          onChange={handleChange('name')}
          labelWidth={100}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="bio">Bio</InputLabel>
        <OutlinedInput
          id="bio"
          placeholder="Bio"
          value={newUser?.bio}
          onChange={handleChange('bio')}
          labelWidth={30}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="website">Website</InputLabel>
        <OutlinedInput
          id="website"
          placeholder="oct.network"
          value={newUser?.websiteURL}
          onChange={handleChange('websiteURL')}
          labelWidth={65}
        />
      </FormControl>

      <FormControl className={style.button} fullWidth variant="outlined">
        <Button variant="contained" color="primary" disableElevation fullWidth onClick={saveUser}>
          Save changes
        </Button>
        {updatingProfile && (
          <CircularProgress size={24} color="primary" className={style.buttonProgress} />
        )}
      </FormControl>
    </div>
  );
};
