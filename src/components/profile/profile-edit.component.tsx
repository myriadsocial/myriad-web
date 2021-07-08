import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { useProfileHook } from './use-profile.hook';

import DialogTitle from 'src/components/common/DialogTitle.component';
import { ImageUpload } from 'src/components/common/ImageUpload.component';
import { SocialListComponent } from 'src/components/user/social-list.component';
import { useUser } from 'src/context/user.context';
import { acronym } from 'src/helpers/string';
import { ExtendedUser } from 'src/interfaces/user';

const useStyles = makeStyles({
  root: {},
  detail: {
    position: 'relative'
  },
  profileContent: {
    width: 420
  },
  avatarBig: {
    height: 72,
    width: 72,
    position: 'absolute',
    top: 46,
    left: 16
  },
  media: {
    height: 159,
    width: 420,
    objectFit: 'cover',
    borderRadius: 8,
    marginTop: 8
  },
  actions: {
    justifyContent: 'space-between'
  },
  logout: {
    textAlign: 'center'
  },
  button: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: '8px'
  },
  button2: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: '8px'
  },
  input: {
    marginTop: 8,
    background: 'white',
    borderRadius: 8,
    '& .MuiInputBase-root': {
      background: 'white'
    }
  },
  subtitle: {
    fontWeight: 700,
    fontSize: 16,
    color: '#4B4851'
  }
});

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

  const { updateProfile } = useProfileHook(user.id);
  const [isPublicKeyCopied, setPublicKeyCopied] = useState(false);
  const [defaultValue, setDefaultValue] = useState<Record<string, string>>({
    name: user.name,
    bio: user.bio ?? ''
  });

  const getProfilePicture = (): string => {
    return userDetail?.profilePictureURL || '';
  };

  const updateProfilePicture = (preview: string) => {
    updateProfile({
      profilePictureURL: preview
    });
  };

  const editBanner = () => {};

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
          Edit Profile YYY
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: 896 }}>
            <div className={style.detail} style={{ marginLeft: 8 }}>
              <Typography className={style.subtitle} variant="body1">
                Profile
              </Typography>
              <CardMedia
                className={style.media}
                image="https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg"
                title={user.name}
              />

              <div className={style.profileContent} style={{ marginTop: 16, marginBottom: 16 }}>
                <ImageUpload
                  value={getProfilePicture()}
                  preview={
                    <Avatar className={style.avatarBig} src={getProfilePicture()}>
                      {acronym(user.name)}
                    </Avatar>
                  }
                  onSelected={updateProfilePicture}
                />

                <Button
                  className={style.button}
                  style={{ position: 'absolute', top: 128, left: 250, backgroundColor: 'white' }}
                  size="medium"
                  variant="outlined"
                  color="primary"
                  disabled
                  onClick={editBanner}>
                  Edit Banner Image
                </Button>
                <form id="editForm" onSubmit={handleSubmit}>
                  <Typography className={style.subtitle} variant="body1">
                    Username
                  </Typography>
                  <TextField
                    name="username"
                    style={{ marginTop: 8 }}
                    disabled={true}
                    fullWidth={true}
                    defaultValue={user.username}
                    inputProps={{ 'aria-label': 'description' }}
                  />

                  <Typography className={style.subtitle} variant="body1" style={{ marginTop: 16 }}>
                    Display Name
                  </Typography>
                  <TextField
                    className={style.input}
                    name="name"
                    onChange={handleChange}
                    fullWidth={true}
                    defaultValue={defaultValue.name}
                    inputProps={{ 'aria-label': 'description' }}
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
                    inputProps={{ 'aria-label': 'description' }}
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
                  defaultValue={user.id}
                  inputProps={{ 'aria-label': 'description' }}
                  endAdornment={
                    <InputAdornment position="end">
                      <CopyToClipboard text={user.id || ''} onCopy={onPublicKeyCopied}>
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
            <Button form="editForm" type="submit" className={style.button2} size="medium" variant="contained" color="primary">
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
