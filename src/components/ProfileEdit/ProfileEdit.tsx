import React, {useState, useEffect} from 'react';

import {FormControl, OutlinedInput, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {IconButtonUpload} from './IconButtonUpload.component';
import {ImageButton} from './ImageButton.component';
import {useStyles} from './profile-edit.style';

import debounce from 'lodash/debounce';
import {acronym} from 'src/helpers/string';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

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

  const style = useStyles();
  const confirm = useConfirm();

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: user.name,
    bio: user.bio,
    websiteURL: user.websiteURL,
  });

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isError, setIsError] = useState(false);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);

  useEffect(() => {
    handleChanges();
    nameValidation();
    if (
      (user?.bio === undefined && newUser?.bio !== '' && newUser?.bio !== undefined) ||
      (user?.bio !== undefined && user?.bio !== newUser?.bio) ||
      user?.name !== newUser.name ||
      (user?.websiteURL === undefined &&
        newUser?.websiteURL !== '' &&
        newUser?.websiteURL !== undefined) ||
      imageProfile instanceof File ||
      (user?.websiteURL !== undefined && user?.websiteURL !== newUser?.websiteURL) ||
      imageProfile === undefined ||
      imageBanner instanceof File
    ) {
      setIsUpdateProfile(true);
    } else {
      setIsUpdateProfile(false);
    }
  }, [newUser, imageProfile, imageBanner]);

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
    if (isEdited) {
      confirm({
        title: i18n.t('Profile.Edit.Prompt_Cancel.Title'),
        description: i18n.t('Profile.Edit.Prompt_Cancel.Desc'),
        confirmationText: i18n.t('Profile.Edit.Prompt_Cancel.Btn_Yes'),
        cancellationText: i18n.t('Profile.Edit.Prompt_Cancel.Btn_Cancel'),
        onConfirm: () => {
          onCancel();
        },
      });
    } else {
      onCancel();
    }
  };

  return (
    <div className={style.root}>
      <Typography className={style.title}>{i18n.t('Profile.Edit.Title')}</Typography>

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined" focused>
        <InputLabel htmlFor="profile-picture" shrink={true} className={style.label}>
          {i18n.t('Profile.Edit.Subtitle_1')}
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
              variant="circular"
              className={style.avatar}>
              {acronym(user.name)}
            </Avatar>
            <ImageButton
              title="Edit Image profile"
              onImageSelected={handleUpdateProfilePicture}
              removePicture={handleRemovePicture}
              loading={uploadingAvatar}
              accept="image"
              imageProfile={imageProfile}
            />
          </div>
        </div>
      </FormControl>

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined" focused>
        <InputLabel htmlFor="background-images" shrink={true} className={style.label}>
          {i18n.t('Profile.Edit.Subtitle_2')}
        </InputLabel>
        <div className={style.bgBox}>
          <CardMedia
            className={style.media}
            image={
              imageBanner
                ? imageBanner instanceof File
                  ? URL.createObjectURL(imageBanner)
                  : user.bannerImageURL
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
        <InputLabel htmlFor="username">{i18n.t('Profile.Edit.Subtitle_3')}</InputLabel>
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
        <InputLabel htmlFor="display-name">{i18n.t('Profile.Edit.Subtitle_4')}</InputLabel>
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
          {i18n.t('Profile.Edit.Required')}
        </Typography>
      )}

      <FormControl classes={{root: style.mb}} fullWidth variant="outlined">
        <InputLabel htmlFor="bio">{i18n.t('Profile.Edit.Subtitle_5')}</InputLabel>
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
        <InputLabel htmlFor="website">{i18n.t('Profile.Edit.Subtitle_6')}</InputLabel>
        <OutlinedInput
          id="website"
          placeholder="mysite.url"
          value={newUser?.websiteURL}
          onChange={handleChange('websiteURL')}
          inputProps={{maxLength: 40}}
          labelWidth={58}
        />
      </FormControl>

      <div className={`${style.flex} ${style.button}`}>
        <Button
          variant="outlined"
          color="secondary"
          disableElevation
          onClick={handleCancel}
          classes={{root: style.width}}
          className={style.hideOnMobile}>
          {i18n.t('General.Cancel')}
        </Button>

        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={saveConfirmation}
          disabled={isError || handleError() || updatingProfile || !isUpdateProfile}
          className={style.width}>
          {i18n.t('Profile.Edit.Btn_Save')}

          {updatingProfile && (
            <CircularProgress size={24} color="primary" className={style.buttonProgress} />
          )}
        </Button>
      </div>
    </div>
  );
};
