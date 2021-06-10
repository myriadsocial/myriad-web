import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { signOut } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { useStyles } from './header.style';
import { useFriendHook } from './use-friend.hook';

import ShowIf from 'src/components/common/show-if.component';
import { ProfileEditComponent } from 'src/components/profile/profile-edit.component';
import { useProfile } from 'src/components/profile/profile.context';
import { SocialListComponent } from 'src/components/user/social-list.component';
import { acronym } from 'src/helpers/string';
import { FriendStatus } from 'src/interfaces/friend';
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
  const [isPublicKeyCopied, setPublicKeyCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const { state: profileState } = useProfile();
  const { makeFriend, checkFriendStatus, cancelFriendRequest, toggleRequest } = useFriendHook(user);

  const style = useStyles();

  useEffect(() => {
    checkFriendStatus(profile?.id);
  }, []);

  const profileInfo =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae nibh eu tellus tincidunt luctus hendrerit in orci. Phasellus vitae tristique nulla. Nam magna massa, sollicitudin sed turpis eros.';

  // SHOW MODAL
  const toggleProfileForm = () => {
    setOpen(!open);
  };

  // FRIEND REQUEST
  const friendRequest = () => {
    console.log('profile', profile);

    makeFriend({
      friendId: profile?.id
    });
  };

  const handlecancelFriendRequest = () => {
    cancelFriendRequest(profileState.friendStatus);
  };

  const approveFriendRequest = () => {
    toggleRequest(profileState.friendStatus, FriendStatus.APPROVED);
  };

  const rejectFriendRequest = () => {
    toggleRequest(profileState.friendStatus, FriendStatus.REJECTED);
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
              <ShowIf condition={profileState.friendStatus?.status == null}>
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
                  className={style.button}
                  style={{ marginRight: 12 }}
                  color="default"
                  variant="contained"
                  size="medium"
                  onClick={rejectFriendRequest}>
                  Ignore
                </Button>
                <Button
                  className={style.button}
                  style={{ marginRight: 24 }}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={approveFriendRequest}>
                  Accept
                </Button>
              </ShowIf>

              <ShowIf condition={profileState.friendStatus?.status === 'pending' && profileState.friendStatus.friendId == profile?.id}>
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
              <SocialListComponent user={user} />
            </div>
          </ShowIf>
        </div>
      </div>

      {/* MODAL */}
      <ProfileEditComponent toggleProfileForm={toggleProfileForm} open={open} user={user} />

      <Snackbar open={isPublicKeyCopied} autoHideDuration={6000} onClose={closeNotify}>
        <Alert onClose={closeNotify} severity="success">
          PublicKey copied!
        </Alert>
      </Snackbar>
    </div>
  );
}
