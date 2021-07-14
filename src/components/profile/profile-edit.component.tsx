import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { encodeAddress } from '@polkadot/util-crypto';

import { useStyles } from './profile-edit.style';
import { useProfileHook } from './use-profile.hook';

import { ButtonUpload } from 'src/components/common/ButtonUpload.component';
import DialogTitle from 'src/components/common/DialogTitle.component';
import { ImageUpload } from 'src/components/common/ImageUpload.component';
import { SocialListComponent } from 'src/components/user/social-list.component';
import { useUser } from 'src/context/user.context';
import { acronym } from 'src/helpers/string';
import { useConfig } from 'src/hooks/config.hook';
import { ExtendedUser } from 'src/interfaces/user';

type ProfileEditProps = {
  user: ExtendedUser;
  toggleProfileForm: () => void;
  open: boolean;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const ProfileEditComponent: React.FC<ProfileEditProps> = ({ user, toggleProfileForm, open }) => {
  const style = useStyles();

  const {
    state: { user: userDetail }
  } = useUser();
  const config = useConfig();

  const { isLoading, updateBanner, updateProfile } = useProfileHook(user.id);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [isPublicKeyCopied, setPublicKeyCopied] = useState(false);
  const [defaultValue, setDefaultValue] = useState<Record<string, string>>({
    name: user.name,
    bio: user.bio ?? ''
  });

  useEffect(() => {
    if (uploadingAvatar && !isLoading) {
      setUploadingAvatar(false);
    }

    if (uploadingBanner && !isLoading) {
      setUploadingBanner(false);
    }
  }, [isLoading, uploadingAvatar, uploadingBanner]);

  const getProfilePicture = (): string => {
    return userDetail?.profilePictureURL || '';
  };

  const updateProfilePicture = (preview: string) => {
    setUploadingAvatar(true);

    updateProfile({
      profilePictureURL: preview
    });
  };

  const updateBannerImage = (image: File): void => {
    setUploadingBanner(true);

    updateBanner(image);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;

    const name = target.name;
    const value = target.value;

    setDefaultValue({
      ...defaultValue,
      [name]: value
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateProfile(defaultValue);
  };

  const onPublicKeyCopied = () => {
    setPublicKeyCopied(true);
  };

  const closeNotify = () => {
    setPublicKeyCopied(false);
  };

  return (
    <>
      <Dialog open={open} aria-labelledby="no-extension-installed" maxWidth="md" fullWidth={false}>
        <DialogTitle id="name" onClose={toggleProfileForm}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: 896 }}>
            <div className={style.detail} style={{ marginLeft: 8 }}>
              <Typography className={style.subtitle} variant="body1">
                Profile
              </Typography>
              <CardMedia className={style.media} image={user.bannerImageUrl ?? config.default.banner} title={user.name} />

              <div className={style.profileContent} style={{ marginTop: 16, marginBottom: 16 }}>
                <ImageUpload
                  value={getProfilePicture()}
                  title={acronym(user.name)}
                  onImageSelected={updateProfilePicture}
                  loading={uploadingAvatar && isLoading}
                />
                <div className={style.bannerUploadWrapper}>
                  <ButtonUpload
                    title="Edit Banner Image"
                    onImageSelected={updateBannerImage}
                    loading={uploadingBanner}
                    accept="image"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    className={style.button}
                  />
                </div>

                <form id="editForm" onSubmit={handleSubmit}>
                  <Typography className={style.subtitle} variant="body1" style={{ marginTop: 16 }}>
                    Display Name
                  </Typography>
                  <TextField
                    className={style.input}
                    name="name"
                    onChange={handleChange}
                    fullWidth={true}
                    defaultValue={defaultValue.name}
                    inputProps={{ 'aria-label': 'profile-name' }}
                  />

                  <Typography className={style.subtitle} variant="body1" style={{ marginTop: 16 }}>
                    Bio
                  </Typography>
                  <TextField
                    className={style.input}
                    name="bio"
                    onChange={handleChange}
                    multiline={true}
                    fullWidth={true}
                    rows={5}
                    defaultValue={defaultValue.bio}
                    inputProps={{ 'aria-label': 'profile-bio' }}
                  />
                </form>
              </div>
            </div>

            <div style={{ width: 360 }}>
              <div>
                <SocialListComponent isAnonymous={user.anonymous} user={user} />
              </div>
              <div style={{ marginTop: '72px' }}>
                <Typography variant="body1" className={style.subtitle}>
                  Public Key
                </Typography>
                <Input
                  className={style.input}
                  style={{ border: '1px solid #8629E9', marginTop: 8 }}
                  name="publickey"
                  disabled={true}
                  fullWidth={true}
                  defaultValue={encodeAddress(user.id)}
                  inputProps={{ 'aria-label': 'public-key' }}
                  endAdornment={
                    <InputAdornment position="end">
                      <CopyToClipboard text={encodeAddress(user.id) || ''} onCopy={onPublicKeyCopied}>
                        <IconButton aria-label="toggle password visibility">
                          <FileCopyIcon />
                        </IconButton>
                      </CopyToClipboard>
                    </InputAdornment>
                  }
                />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 44, marginBottom: 32, textAlign: 'center' }}>
            <Button
              form="editForm"
              type="submit"
              className={style.button2}
              size="medium"
              variant="contained"
              color="primary"
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress size={20} style={{ color: 'white' }} thickness={6} color="inherit" />}>
              Save Setting
            </Button>
          </div>
        </DialogContent>
        <Snackbar open={isPublicKeyCopied} autoHideDuration={6000} onClose={closeNotify}>
          <Alert onClose={closeNotify} severity="success">
            PublicKey copied!
          </Alert>
        </Snackbar>
      </Dialog>
    </>
  );
};

ProfileEditComponent.defaultProps = {};
