import React, {useState, useEffect} from 'react';

import {FormControl, OutlinedInput, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';

import {acronym} from '../../../helpers/string';
import {User} from '../../../interfaces/user';
import {PromptComponent} from '../../atoms/Prompt/prompt.component';
import {IconButtonUpload} from './IconButtonUpload.component';
import {ImageButton} from './ImageButton.component';
import {useStyles} from './profile-edit.style';

import {debounce} from 'lodash';

export type Props = {
  user: User;
  imageProfile: File | string | undefined;
  imageBanner: File | string | undefined;
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
  uploadingAvatar: boolean;
  uploadingBanner: boolean;
  updatingProfile: boolean;
  isChanged: boolean;
  isAvailable?: boolean;
  updateProfileBanner: (image: File) => void;
  updateProfilePicture: (image: File | undefined) => void;
  checkAvailable: (username: string) => void;
};

export const ProfileEditComponent: React.FC<Props> = props => {
  const {
    user,
    imageProfile,
    imageBanner,
    onSave,
    onCancel,
    updatingProfile,
    uploadingBanner,
    updateProfileBanner,
    uploadingAvatar,
    updateProfilePicture,
    isChanged,
    isAvailable,
  } = props;
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: user.name,
    bio: user.bio,
    websiteURL: user.websiteURL,
  });

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [isError, setIsError] = useState(false);

  const style = useStyles();

  useEffect(() => {
    handleChanges();
    nameValidation();
  }, [newUser]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(prevUser => ({
      ...prevUser,
      [field]: event.target.value,
    }));
  };

  const saveUser = async () => {
    if (!isChanged && isAvailable) {
      onSave(newUser);
    } else {
      if (newUser) {
        onSave(newUser);
      }
    }
  };

  const saveConfirmation = () => {
    saveUser();
  };

  const handleRemovePicture = (image: Partial<User>) => {
    updateProfilePicture(undefined);
    setIsEdited(true);
  };

  const hanleUpdateBannerImage = (image: File): void => {
    updateProfileBanner(image);
    setIsEdited(true);
  };

  const handleUpdateProfilePicture = (image: File): void => {
    updateProfilePicture(image);
    setIsEdited(true);
  };

  const handleError = (): boolean => {
    if (isAvailable === undefined) return false;
    if (typeof isAvailable === 'boolean') {
      if (isAvailable === true) return false;
      if (isAvailable === false) return true;
    }
    return false;
  };

  const nameValidation = debounce(() => {
    if (!newUser.name || newUser.name?.length < 2) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, 300);

  const handleChanges = () => {
    const a = user.bio === newUser.bio;
    const b = user.name === newUser.name;
    const c = user.websiteURL === newUser.websiteURL;
    setIsEdited(!a || !b || !c);
  };

  const handleCancel = () => {
    isEdited && openPrompt();
    !isEdited && onCancel();
  };

  const openPrompt = () => {
    setOpen(!open);
  };

  const handleOpenConfirmation = () => {
    setOpenConfirmation(!openConfirmation);
  };

  return (
    <div className={style.root}>
      <Typography className={style.title}>Edit Profile</Typography>

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined" focused>
        <InputLabel htmlFor="profile-picture" shrink={true} className={style.label}>
          Profile Picture
        </InputLabel>
        <div className={style.pictureBox}>
          <div className={style.box}>
            <Avatar
              alt={user.name}
              src={
                imageProfile
                  ? imageProfile instanceof File
                    ? URL.createObjectURL(imageProfile)
                    : imageProfile
                  : ''
              }
              variant="circle"
              className={style.avatar}>
              {acronym(user.name)}
            </Avatar>
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

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined" focused>
        <InputLabel htmlFor="background-images" shrink={true} className={style.label}>
          Background Image
        </InputLabel>
        <div className={style.bgBox}>
          <CardMedia
            className={style.media}
            image={
              imageBanner
                ? imageBanner instanceof File
                  ? URL.createObjectURL(imageBanner)
                  : user.bannerImageUrl
                : ''
            }
            title={user.name}
          />
          <IconButtonUpload
            title="Edit Banner Image"
            onImageSelected={hanleUpdateBannerImage}
            loading={uploadingBanner}
            accept="image"
          />
        </div>
      </FormControl>

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined">
        <InputLabel htmlFor="username">Username</InputLabel>
        <OutlinedInput
          error={handleError()}
          disabled
          id="username"
          placeholder="Username"
          value={user.username}
          labelWidth={70}
          startAdornment={'@'}
          inputProps={{maxLength: 16}}
        />
      </FormControl>

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined">
        <InputLabel htmlFor="display-name">Display Name</InputLabel>
        <OutlinedInput
          id="display-name"
          placeholder="Display Name"
          value={newUser?.name}
          onChange={handleChange('name')}
          labelWidth={93}
          inputProps={{maxLength: 22}}
          error={isError}
        />
      </FormControl>

      {isError && (
        <Typography className={`${style.available} ${style.red} ${style.validation}`}>
          Required min 2 characters
        </Typography>
      )}

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined">
        <InputLabel htmlFor="bio">Bio</InputLabel>
        <OutlinedInput
          id="bio"
          placeholder="Bio"
          value={newUser?.bio}
          onChange={handleChange('bio')}
          labelWidth={23}
          inputProps={{maxLength: 160}}
          multiline
        />
      </FormControl>

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined">
        <InputLabel htmlFor="website">Website</InputLabel>
        <OutlinedInput
          id="website"
          placeholder="mysite.url"
          value={newUser?.websiteURL}
          onChange={handleChange('websiteURL')}
          labelWidth={58}
        />
      </FormControl>

      <div className={`${style.flex} ${style.button}`}>
        <FormControl variant="outlined">
          <Button
            variant="outlined"
            color="secondary"
            disableElevation
            onClick={handleCancel}
            classes={{root: style.width}}>
            Cancel
          </Button>
        </FormControl>
        <FormControl variant="outlined">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={saveConfirmation}
            disabled={isError || handleError() || updatingProfile}
            classes={{root: style.width}}>
            Save changes
          </Button>
          {updatingProfile && (
            <CircularProgress size={24} color="primary" className={style.buttonProgress} />
          )}
        </FormControl>
      </div>
      <PromptComponent
        title="Are you sure?"
        subtitle={
          <>
            <Typography>{'You already made some changes,'}</Typography>
            <Typography>{'sure you want to leave it?'}</Typography>
          </>
        }
        icon="warning"
        open={open}
        onCancel={openPrompt}>
        <div className={style.flexCenter}>
          <Button
            className={style.m1}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={openPrompt}>
            No, let me rethink
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={onCancel}>
            Yes, Leave it
          </Button>
        </div>
      </PromptComponent>
      <PromptComponent
        title="Are you sure?"
        subtitle={
          <>
            <Typography>
              <b>Username</b> cannot be change later
            </Typography>
            <Typography>
              but you can still change your <b>Display Name</b>
            </Typography>
          </>
        }
        icon="warning"
        open={openConfirmation}
        onCancel={handleOpenConfirmation}>
        <div className={style.flexCenter}>
          <Button
            className={style.m1}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleOpenConfirmation}>
            No, Let me think
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={saveUser}>
            Yes, Let’s go
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
