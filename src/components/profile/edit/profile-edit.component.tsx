import React, {useEffect, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useSelector} from 'react-redux';

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
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';

import {encodeAddress} from '@polkadot/util-crypto';

import {useProfileHook} from '../use-profile.hook';
import {useStyles} from './profile-edit.style';

import {ButtonUpload} from 'src/components/common/ButtonUpload.component';
import DialogTitle from 'src/components/common/DialogTitle.component';
import {ImageUpload} from 'src/components/common/ImageUpload.component';
import {SocialListComponent} from 'src/components/user/social-list.component';
import {acronym} from 'src/helpers/string';
import {useConfig} from 'src/hooks/config.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type ProfileEditProps = {
  toggleProfileForm: () => void;
  open: boolean;
};

//TODO: remove, use global alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const ProfileEditComponent: React.FC<ProfileEditProps> = ({toggleProfileForm, open}) => {
  const style = useStyles();
  const config = useConfig();

  const {loading, updateProfile, updateProfileBanner, updateProfilePicture} = useProfileHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [isPublicKeyCopied, setPublicKeyCopied] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
  });

  useEffect(() => {
    if (uploadingAvatar && !loading) {
      setUploadingAvatar(false);
    }

    if (uploadingBanner && !loading) {
      setUploadingBanner(false);
    }
  }, [loading, uploadingAvatar, uploadingBanner]);

  const getProfilePicture = (): string => {
    return user?.profilePictureURL || '';
  };

  const handleUpdateProfilePicture = (preview: string): void => {
    setUploadingAvatar(true);

    updateProfilePicture(preview);
  };

  const hanleUpdateBannerImage = async (image: File): Promise<void> => {
    setUploadingBanner(true);

    updateProfileBanner(image);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;

    const name = target.name;
    const value = target.value;

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateProfile(profile);
  };

  const onPublicKeyCopied = () => {
    setPublicKeyCopied(true);
  };

  const closeNotify = () => {
    setPublicKeyCopied(false);
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={open} aria-labelledby="no-extension-installed" maxWidth="md" fullWidth={false}>
        <DialogTitle id="name" onClose={toggleProfileForm}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <div style={{display: 'flex', justifyContent: 'space-around', width: 896}}>
            <div className={style.detail} style={{marginLeft: 8}}>
              <Typography className={style.subtitle} variant="body1">
                Profile
              </Typography>
              <CardMedia
                className={style.media}
                image={user.bannerImageUrl ?? config.default.banner}
                title={user.name}
              />

              <div className={style.profileContent} style={{marginTop: 16, marginBottom: 16}}>
                <ImageUpload
                  value={getProfilePicture()}
                  title={acronym(user.name)}
                  onImageSelected={handleUpdateProfilePicture}
                  loading={uploadingAvatar && loading}
                />
                <div className={style.bannerUploadWrapper}>
                  <ButtonUpload
                    title="Edit Banner Image"
                    onImageSelected={hanleUpdateBannerImage}
                    loading={uploadingBanner}
                    accept="image"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    className={style.button}
                  />
                </div>

                <form id="editForm" onSubmit={handleSubmit}>
                  <Typography className={style.subtitle} variant="body1" style={{marginTop: 16}}>
                    Display Name
                  </Typography>
                  <TextField
                    className={style.input}
                    name="name"
                    onChange={handleChange}
                    fullWidth={true}
                    defaultValue={profile.name}
                    inputProps={{'aria-label': 'profile-name'}}
                  />

                  <Typography className={style.subtitle} variant="body1" style={{marginTop: 16}}>
                    Bio
                  </Typography>
                  <TextField
                    className={style.input}
                    name="bio"
                    onChange={handleChange}
                    multiline={true}
                    fullWidth={true}
                    rows={5}
                    defaultValue={profile.bio}
                    inputProps={{'aria-label': 'profile-bio'}}
                  />
                </form>
              </div>
            </div>

            <div style={{width: 360}}>
              <div>
                <SocialListComponent isAnonymous={user.anonymous} />
              </div>
              <div style={{marginTop: '72px'}}>
                <Typography variant="body1" className={style.subtitle}>
                  Public Key
                </Typography>
                <Input
                  className={style.input}
                  style={{border: '1px solid #8629E9', marginTop: 8}}
                  name="publickey"
                  disabled={true}
                  fullWidth={true}
                  defaultValue={encodeAddress(user.id)}
                  inputProps={{'aria-label': 'public-key'}}
                  endAdornment={
                    <InputAdornment position="end">
                      <CopyToClipboard
                        text={encodeAddress(user.id) || ''}
                        onCopy={onPublicKeyCopied}>
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
          <div style={{marginTop: 44, marginBottom: 32, textAlign: 'center'}}>
            <Button
              form="editForm"
              type="submit"
              className={style.button2}
              size="medium"
              variant="contained"
              color="primary"
              disabled={loading}
              endIcon={
                loading && (
                  <CircularProgress
                    size={20}
                    style={{color: 'white'}}
                    thickness={6}
                    color="inherit"
                  />
                )
              }>
              Save Setting
            </Button>
          </div>
        </DialogContent>

        {/* TODO: remove, use global alert */}
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
