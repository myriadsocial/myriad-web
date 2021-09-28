import {CameraIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';

import {Typography} from '@material-ui/core';
import {FormControl, OutlinedInput} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import SvgIcon from '@material-ui/core/SvgIcon';

import {User} from '../../../interfaces/user';
import {useStyles} from './profile-edit.style';

export type Props = {
  user: User;
  onSave: (user: Partial<User>) => void;
  uploadingAvatar: boolean;
};

export const ProfileEditComponent: React.FC<Props> = props => {
  const {user, onSave} = props;
  const [newUser, setNewUser] = useState<Partial<User>>();
  const style = useStyles();

  useEffect(() => {
    if (user) {
      setNewUser(user);
    }
  }, [user]);

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
            <IconButton
              className={style.position}
              classes={{root: style.action}}
              aria-label="profile-setting">
              <SvgIcon component={CameraIcon} viewBox="0 0 24 24" />
            </IconButton>
          </div>
        </div>
      </FormControl>

      <FormControl fullWidth variant="outlined" focused>
        <InputLabel htmlFor="background-images" shrink={true} className={style.label}>
          Background Image
        </InputLabel>
        <div className={style.bgBox}>
          <CardMedia className={style.media} image={user.bannerImageUrl} title={user.name} />
          <IconButton classes={{root: style.action}} aria-label="profile-setting">
            <SvgIcon component={CameraIcon} viewBox="0 0 24 24" />
          </IconButton>
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
          placeholder="Boct.networkio"
          value={newUser?.websiteURL}
          onChange={handleChange('websiteURL')}
          labelWidth={110}
        />
      </FormControl>

      <FormControl className={style.button} fullWidth variant="outlined">
        <Button variant="contained" color="primary" disableElevation fullWidth onClick={saveUser}>
          Save changes
        </Button>
      </FormControl>
    </div>
  );
};
