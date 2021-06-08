import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { signOut } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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

import DialogTitle from '../common/DialogTitle.component';
import { useStyles } from './header.style';
import { useFriendHook } from './use-friend.hook';
import { useProfileHook } from './use-profile.hook';

// import { EditableTextField } from 'src/components/common/EditableTextField';
import { ImageUpload } from 'src/components/common/ImageUpload.component';
import ShowIf from 'src/components/common/show-if.component';
import { useProfile } from 'src/components/profile/profile.context';
import { SocialListComponent } from 'src/components/user/social-list.component';
import { acronym } from 'src/helpers/string';
import { ExtendedUser, ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: ExtendedUser;
  profile: ExtendedUserPost | null;
  loading: Boolean;
  isGuest: Boolean;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Header({ user, profile, loading, isGuest }: Props) {
  const [isEditProfile, showEditProfile] = useState(false);
  const [isMnemonicCopied, setMnemonicCopied] = useState(false);
  const [isPublicKeyCopied, setPublicKeyCopied] = useState(false);

  const [defaultValue, setDefaultValue] = useState({
    name: profile?.name,
    bio: profile?.bio
  });

  const { state: profileState } = useProfile();
  const { updateProfile } = useProfileHook(user.id);
  const { makeFriend, checkFriendStatus } = useFriendHook(user);
  const [cookie] = useCookies(['seed']);
  const style = useStyles();

  useEffect(() => {
    checkFriendStatus(profile?.id);
    console.log(profileState.friendStatus, 'friendsttus <<<<<');
  }, []);

  const profileInfo =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae nibh eu tellus tincidunt luctus hendrerit in orci. Phasellus vitae tristique nulla. Nam magna massa, sollicitudin sed turpis eros.';

  // SHOW MODAL
  const openEditProfile = () => {
    showEditProfile(true);
  };

  const closeEditProfile = () => {
    showEditProfile(false);
  };

  const getProfilePicture = (): string => {
    const avatar = profile?.profilePictureURL as string;
    return avatar || '';
  };

  // FRIEND REQUEST
  const friendRequest = () => {
    console.log('profile', profile);

    makeFriend({
      friendId: profile?.id
    });
  };

  // EDIT fn PROFILE
  const updateProfilePicture = (preview: string) => {
    updateProfile({
      profilePictureURL: preview
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setDefaultValue({
      ...defaultValue,
      [name as string]: value as string
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile(defaultValue);
    showEditProfile(false);
  };

  // PUBLICKEY;
  const onPublicKeyCopied = () => {
    setPublicKeyCopied(true);
  };

  // MNEMONIC fn
  const onMnemonicCopied = () => {
    setMnemonicCopied(true);
  };

  const closeNotify = () => {
    setMnemonicCopied(false);
    setPublicKeyCopied(false);
  };

  // Handle LOGOUT
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      redirect: true
    });
  };

  return (
    <div className={style.root}>
      <div className={style.header}>
        <div style={{ width: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar className={style.avatar} src={profile?.profilePictureURL}>
              {acronym(profile?.name || '')}
            </Avatar>
            <Typography className={style.name}>{profile?.name || ''}</Typography>
          </div>
          <div style={{ marginTop: '24px' }}>
            <Typography variant="body1" className={style.subtitle}>
              Bio
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 400, fontSize: 16, marginTop: 8 }}>
              {profile?.bio || profileInfo}
            </Typography>
          </div>
          <ShowIf condition={isGuest === false}>
            <div style={{ marginTop: '24px' }}>
              <Typography variant="body1" className={style.subtitle}>
                Public Key
              </Typography>
              <Input
                className={style.input}
                style={{ width: 400, border: '1px solid #8629E9' }}
                name="publickey"
                disabled={true}
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
          </ShowIf>
          <ShowIf condition={isGuest === true}>
            <div style={{ marginTop: '40px' }}>
              <ShowIf condition={profileState.friendStatus == null}>
                <Button
                  className={style.button2}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={friendRequest}>
                  Add Friends
                </Button>
              </ShowIf>

              <ShowIf condition={profileState.friendStatus?.status === 'pending' && profileState.friendStatus.requestorId == profile?.id}>
                <Button
                  className={style.button2}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={() => console.log('acc')}>
                  Accept
                </Button>
                <Button
                  className={style.button2}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={() => console.log('decline')}>
                  Ignore
                </Button>
              </ShowIf>

              <ShowIf condition={profileState.friendStatus?.status === 'pending' && profileState.friendStatus.friendId == profile?.id}>
                <Button
                  className={style.button2}
                  variant="contained"
                  size="medium"
                  disabled
                  style={{ background: 'gray', marginRight: 24 }}>
                  Pending
                </Button>
                <Button
                  className={style.button2}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={() => console.log('cancel')}>
                  Cancel
                </Button>
              </ShowIf>

              <ShowIf condition={profileState.friendStatus?.status === 'approved'}>
                <Button
                  className={style.button2}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={() => console.log('unFriend')}>
                  Unfriend
                </Button>
              </ShowIf>

              <Button
                className={style.button2}
                color="primary"
                variant="outlined"
                size="medium"
                disabled
                onClick={() => console.log('send a message')}>
                Send a Message
              </Button>
            </div>
          </ShowIf>
        </div>

        <div style={{ width: 315 }}>
          <ShowIf condition={isGuest === false}>
            <div style={{ textAlign: 'right' }}>
              <Button
                className={style.button}
                style={{ marginRight: 24 }}
                size="medium"
                variant="contained"
                color="primary"
                onClick={openEditProfile}>
                Edit Profile
              </Button>
              <Button
                className={style.button}
                size="medium"
                variant="outlined"
                color="primary"
                style={{ marginRight: 8 }}
                onClick={handleSignOut}>
                Logout
              </Button>
            </div>
            <div style={{ marginTop: '30px' }}>
              <SocialListComponent user={user} />
            </div>
          </ShowIf>
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={isEditProfile} aria-labelledby="no-extension-installed" maxWidth="md" fullWidth={false}>
        <DialogTitle id="name" onClose={closeEditProfile}>
          Edit Profile
        </DialogTitle>

        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: 896 }}>
            <div className={style.detail} style={{ marginLeft: 8 }}>
              <Typography className={style.subtitle} variant="body1">
                Profile
              </Typography>
              <CardMedia
                style={{ marginTop: 8 }}
                className={style.media}
                image="https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg"
                title={profile?.name || 'Avatar'}
              />

              <div className={style.profileContent} style={{ marginTop: 16, marginBottom: 16 }}>
                <ImageUpload
                  value={getProfilePicture()}
                  preview={
                    <Avatar className={style.avatarBig} src={getProfilePicture()}>
                      {acronym(profile?.name || '')}
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
                  onClick={() => console.log('edit banner')}>
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
                    defaultValue={profile?.username}
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
                <SocialListComponent user={user} />
              </div>
              <div style={{ marginTop: '72px' }}>
                <Typography className={style.subtitle} variant="body1">
                  Mnemonic Seed
                </Typography>
                <CopyToClipboard text={cookie.uri || ''} onCopy={onMnemonicCopied}>
                  <Button
                    size="medium"
                    color="primary"
                    variant="outlined"
                    className={style.logout}
                    style={{ backgroundColor: 'white', marginTop: 8 }}>
                    Copy Mnemonic Seed
                    <FileCopyIcon />
                  </Button>
                </CopyToClipboard>
              </div>
              <div style={{ marginTop: '24px' }}>
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
        <Snackbar open={isMnemonicCopied} autoHideDuration={6000} onClose={closeNotify}>
          <Alert onClose={closeNotify} severity="success">
            Mnemonic copied!
          </Alert>
        </Snackbar>
      </Dialog>
      <Snackbar open={isPublicKeyCopied} autoHideDuration={6000} onClose={closeNotify}>
        <Alert onClose={closeNotify} severity="success">
          PublicKey copied!
        </Alert>
      </Snackbar>
    </div>
  );
}
