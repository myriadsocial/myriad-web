import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { signOut } from 'next-auth/client';
import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import DialogTitle from '../common/DialogTitle.component';
// import ShowIf from '../common/show-if.component';
import { useStyles } from './header.style';
import { useFriendHook } from './use-friend.hook';
import { useProfileHook } from './use-profile.hook';

import { EditableTextField } from 'src/components/common/EditableTextField';
import { ImageUpload } from 'src/components/common/ImageUpload.component';
import { acronym } from 'src/helpers/string';
import { User, ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: User;
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

  const { updateProfile } = useProfileHook(user.id);
  const { makeFriend, status, requestFriendStatus } = useFriendHook(user);
  const [cookie] = useCookies(['seed']);
  const style = useStyles();

  useEffect(() => {
    requestFriendStatus(profile?.id);
  }, [status]);

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
  // const friendRequest = () => {
  //   makeFriend({
  //     friendId: profile?.id
  //   });
  // };

  // UPDATE fn
  const updateName = (value: string) => {
    updateProfile({
      name: value
    });
  };

  const updateProfilePicture = (preview: string) => {
    updateProfile({
      profilePictureURL: preview
    });
  };

  const updateProfileBio = (value: string) => {
    updateProfile({
      bio: value
    });
  };

  // PUBLICKEY
  // const onPublicKeyCopied = () => {
  //   setPublicKeyCopied(true);
  // };

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
    <div className="header" style={{ marginBottom: 10, position: 'relative' }}>
      <div>
        <Typography variant="h4" style={{ marginBottom: 8, fontWeight: 500 }}>
          <Link href="/home">
            <a style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowBackIcon />
              Home
            </a>
          </Link>
        </Typography>
      </div>

      <div className={style.header}>
        <div className="leftSide">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar className={style.avatar} src={profile?.profilePictureURL}>
              {acronym(profile?.name || '')}
            </Avatar>
            <Typography className={style.name}>{profile?.name || ''}</Typography>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Typography variant="body1" style={{ fontWeight: 700, fontSize: 16 }}>
              Bio
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 400, fontSize: 16 }}>
              {profile?.bio || profileInfo}
            </Typography>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Typography variant="body1" style={{ fontWeight: 700, fontSize: 16 }}>
              Mnemonic Seed
            </Typography>
            <CopyToClipboard text={cookie.uri || ''} onCopy={onMnemonicCopied}>
              <Button size="medium" color="primary" variant="outlined" className={style.logout}>
                Copy Mnemonic Seed
                <FileCopyIcon />
              </Button>
            </CopyToClipboard>
          </div>
        </div>

        <div className="rightSide" style={{ width: 315 }}>
          <div style={{ textAlign: 'right' }}>
            <Button className={style.button} size="small" variant="contained" color="primary" onClick={openEditProfile}>
              Edit Profile
            </Button>
            <Button className={style.button} size="small" variant="outlined" color="primary" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
          <div style={{ marginTop: '30px' }}>
            <Typography variant="body1" style={{ fontWeight: 700, fontSize: 16 }}>
              Link my Social
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 1px', marginTop: '10px' }}>
              <Typography variant="body2" style={{ fontSize: 16, fontWeight: 400 }}>
                Facebook
              </Typography>

              <IconButton style={{ color: '#53C51E' }} aria-label="upload picture" size="small">
                <CheckIcon />
              </IconButton>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 1px', marginTop: '10px' }}>
              <Typography variant="body2" style={{ fontSize: 16, fontWeight: 400 }}>
                Twitter
              </Typography>
              <IconButton aria-label="upload picture" size="small">
                <AddIcon />
              </IconButton>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <Typography variant="body2" style={{ fontSize: 16, fontWeight: 400 }}>
                Reddit
              </Typography>
              <IconButton aria-label="upload picture" size="small">
                <AddIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={isEditProfile} aria-labelledby="no-extension-installed" maxWidth="sm">
        <DialogTitle id="name" onClose={closeEditProfile}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Card className={style.detail}>
            <CardMedia
              className={style.media}
              image="https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg"
              title={profile?.name || 'Avatar'}
            />

            <CardContent className={style.profileContent}>
              <ImageUpload
                value={getProfilePicture()}
                preview={
                  <Avatar className={style.avatarBig} src={getProfilePicture()}>
                    {acronym(profile?.name || '')}
                  </Avatar>
                }
                onSelected={updateProfilePicture}
              />

              <EditableTextField
                name="profile.name"
                value={profile?.name || ''}
                onChange={updateName}
                fullWidth={true}
                style={{ fontSize: 20 }}
              />

              <EditableTextField
                name="profile.bio"
                value={profile?.bio || profileInfo}
                onChange={updateProfileBio}
                multiline={true}
                fullWidth={true}
              />
            </CardContent>

            <CardActions className={style.actions}>
              <CopyToClipboard text={cookie.uri || ''} onCopy={onMnemonicCopied}>
                <Button size="medium" color="primary" variant="contained" className={style.logout}>
                  Copy Mnemonic Seed
                  <FileCopyIcon />
                </Button>
              </CopyToClipboard>

              <Button size="medium" color="secondary" variant="contained" className={style.logout} onClick={handleSignOut}>
                Logout
              </Button>
            </CardActions>
          </Card>
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
