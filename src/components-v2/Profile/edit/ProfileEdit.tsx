import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {FormControl, OutlinedInput} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';

import {IconButtonUpload} from '../../../components/common/IconButtonUpload.component';
import {ImageButton} from '../../../components/common/ImageButton.component';
import {User} from '../../../interfaces/user';
import {useStyles} from './profile-edit.style';

export type Props = {
  user: User;
  onSave: (user: Partial<User>) => void;
  uploadingAvatar: boolean;
  uploadingBanner: boolean;
  updatingProfile: boolean;
  updateProfileBanner: (image: File) => void;
  updateProfilePicture: (image: File) => void;
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
  } = props;
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: user.username ?? '',
    name: user.name ?? '',
    bio: user.bio ?? '',
    websiteURL: user.websiteURL ?? '',
  });
  const style = useStyles();

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(prevUser => ({
      ...prevUser,
      [field]: event.target.value,
    }));
  };

  const saveUser = () => {
    if (newUser) {
      onSave(newUser);
    }
  };

  const hanleUpdateBannerImage = (image: File): void => {
    updateProfileBanner(image);
  };

  const handleUpdateProfilePicture = (image: File): void => {
    updateProfilePicture(image);
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
          id="username"
          placeholder="Username"
          value={newUser?.username}
          onChange={handleChange('username')}
          labelWidth={110}
        />
      </FormControl>

      <Typography className={style.marker}>
        You have used the attempt to change your name
      </Typography>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="display-name">Display Name</InputLabel>
        <OutlinedInput
          id="display-name"
          placeholder="Display Name"
          value={newUser?.name}
          onChange={handleChange('name')}
          labelWidth={110}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="bio">Bio</InputLabel>
        <OutlinedInput
          id="bio"
          placeholder="Bio"
          value={newUser?.bio}
          onChange={handleChange('bio')}
          labelWidth={110}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="website">Website</InputLabel>
        <OutlinedInput
          id="website"
          placeholder="oct.network"
          value={newUser?.websiteURL}
          onChange={handleChange('websiteURL')}
          labelWidth={110}
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
