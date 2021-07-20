import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';

import { signOut } from 'next-auth/client';

import { SvgIcon } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { encodeAddress } from '@polkadot/util-crypto';

import { useStyles } from './header.style';
import { useFriendHook } from './use-friend.hook';

import DialogTitle from 'src/components/common/DialogTitle.component';
import ShowIf from 'src/components/common/show-if.component';
import { ProfileEditComponent } from 'src/components/profile/profile-edit.component';
import { useProfile } from 'src/components/profile/profile.context';
import { SocialListComponent } from 'src/components/user/social-list.component';
import { acronym } from 'src/helpers/string';
import RemoveUser from 'src/images/user-minus2.svg';
import { FriendStatus } from 'src/interfaces/friend';
import { ExtendedUserPost } from 'src/interfaces/user';
import { RootState } from 'src/reducers';
import { UserState } from 'src/reducers/user/reducer';

type Props = {
  isAnonymous: boolean;
  profile: ExtendedUserPost | null;
  loading: boolean;
  isGuest: boolean;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Header({ isAnonymous, profile, loading, isGuest }: Props) {
  const style = useStyles();

  const { user } = useSelector<RootState, UserState>(state => state.userState);
  const [isPublicKeyCopied, setPublicKeyCopied] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const {
    state: { friendStatus }
  } = useProfile();
  const { makeFriend, checkFriendStatus, cancelFriendRequest, toggleRequest } = useFriendHook(user);

  useEffect(() => {
    checkFriendStatus(profile?.id);
  }, []);

  const profileInfo =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae nibh eu tellus tincidunt luctus hendrerit in orci. Phasellus vitae tristique nulla. Nam magna massa, sollicitudin sed turpis eros.';

  // SHOW MODAL
  const toggleProfileForm = () => {
    setOpenEditModal(!openEditModal);
  };

  // SHOW REMOVE ALERT MODAL
  const toggleRemoveAlert = () => {
    setOpenRemoveModal(!openRemoveModal);
  };

  // FRIEND REQUEST
  const handleSendFriendRequest = () => {
    makeFriend({ friendId: profile?.id });
  };

  const handleUnFriendRequest = () => {
    if (friendStatus) cancelFriendRequest(friendStatus);
    toggleRemoveAlert();
  };

  const handlecancelFriendRequest = () => {
    if (friendStatus) cancelFriendRequest(friendStatus);
  };

  const handleApproveFriendRequest = () => {
    if (friendStatus) toggleRequest(friendStatus, FriendStatus.APPROVED);
  };

  const handleRejectFriendRequest = () => {
    if (friendStatus) toggleRequest(friendStatus, FriendStatus.REJECTED);
  };

  // PUBLICKEY;
  const onPublicKeyCopied = () => {
    setPublicKeyCopied(true);
  };

  const closeNotify = () => {
    setPublicKeyCopied(false);
  };

  // Handle LOGOUT
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      redirect: true
    });
  };

  if (profile === null) {
    return (
      <div className={style.root}>
        <div className={style.header}>
          <div style={{ width: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar className={style.avatar} src={''}>
                {acronym('')}
              </Avatar>
              <Typography className={style.name}>{''}</Typography>
            </div>
            <div style={{ marginTop: '24px' }}>
              <Typography variant="body1" className={style.subtitle}>
                Bio
              </Typography>
              <Typography variant="body2" style={{ fontWeight: 400, fontSize: 16, marginTop: 8 }}>
                {profileInfo}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.root}>
      <div className={style.header}>
        <div style={{ width: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar className={style.avatar} src={profile.profilePictureURL}>
              {acronym(profile.name || '')}
            </Avatar>
            <Typography className={style.name}>{profile.name || ''}</Typography>
          </div>
          <div style={{ marginTop: '24px' }}>
            <Typography variant="body1" className={style.subtitle}>
              Bio
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 400, fontSize: 16, marginTop: 8 }}>
              {profile.bio || profileInfo}
            </Typography>
          </div>
          <div style={{ marginTop: '24px' }}>
            <Typography variant="body1" className={style.subtitle}>
              Public Key
            </Typography>
            <Input
              className={style.input}
              style={{ width: 400, border: '1px solid #8629E9' }}
              name="publickey"
              disabled={true}
              defaultValue={encodeAddress(profile.id)}
              inputProps={{ 'aria-label': 'description' }}
              endAdornment={
                <InputAdornment position="end">
                  <CopyToClipboard text={encodeAddress(profile.id) || ''} onCopy={onPublicKeyCopied}>
                    <IconButton aria-label="toggle password visibility">
                      <FileCopyIcon />
                    </IconButton>
                  </CopyToClipboard>
                </InputAdornment>
              }
            />
          </div>
          <ShowIf condition={isGuest === true}>
            <div style={{ marginTop: '24px' }}>
              <ShowIf condition={friendStatus?.status == null}>
                <Button
                  disabled={isAnonymous}
                  className={style.button2}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  startIcon={<PersonAddIcon />}
                  onClick={handleSendFriendRequest}>
                  Add Friend
                </Button>
              </ShowIf>

              <ShowIf condition={friendStatus?.status === 'pending' && friendStatus.requestorId == profile.id}>
                <Button
                  className={style.button}
                  style={{ marginRight: 12 }}
                  color="default"
                  variant="contained"
                  size="medium"
                  onClick={handleRejectFriendRequest}>
                  Ignore
                </Button>
                <Button
                  className={style.button}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={handleApproveFriendRequest}>
                  Accept
                </Button>
              </ShowIf>

              <ShowIf condition={friendStatus?.status === 'pending' && friendStatus.friendId == profile.id}>
                <Button className={style.button} variant="contained" size="medium" disabled style={{ background: 'gray', marginRight: 12 }}>
                  Pending
                </Button>
                <Button
                  className={style.button}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={handlecancelFriendRequest}>
                  Cancel
                </Button>
              </ShowIf>

              <ShowIf condition={friendStatus?.status === 'approved'}>
                <Button
                  className={style.button2}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  startIcon={<RemoveUser />}
                  onClick={toggleRemoveAlert}>
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
                onClick={toggleProfileForm}>
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
              <SocialListComponent isAnonymous={isAnonymous} />
            </div>
          </ShowIf>
        </div>
      </div>

      {/* MODAL */}
      {user && <ProfileEditComponent toggleProfileForm={toggleProfileForm} open={openEditModal} user={user} />}

      <Dialog open={openRemoveModal} aria-labelledby="no-extension-installed">
        <DialogTitle id="name" onClose={toggleRemoveAlert}>
          Remove Friend
        </DialogTitle>
        <DialogContent>
          <div className={style.dialogRoot}>
            <SvgIcon className={style.icon} fontSize="inherit" color="error">
              <WarningRoundedIcon />
            </SvgIcon>
            <Typography className={style.subtitle1} variant="h2" color="error">
              Unfriend {profile.name}
            </Typography>
            <Typography className={`${style.subtitle2} ${style.alertMessage}  ${style.center} ${style['m-vertical2']}`}>
              Are you sure want to remove this person from your friend list? You will{' '}
              <Typography variant="inherit" color="error">
                no longer see posts
              </Typography>{' '}
              from this person.
            </Typography>
            <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
              <Button variant="text" onClick={toggleRemoveAlert}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleUnFriendRequest}>
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar open={isPublicKeyCopied} autoHideDuration={6000} onClose={closeNotify}>
        <Alert onClose={closeNotify} severity="success">
          PublicKey copied!
        </Alert>
      </Snackbar>
    </div>
  );
}
