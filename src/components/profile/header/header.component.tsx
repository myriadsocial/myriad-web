import React, {useState, useEffect} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useSelector} from 'react-redux';

import {signOut} from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {encodeAddress} from '@polkadot/util-crypto';

import {ProfileEditComponent} from '../edit/profile-edit.component';
import {useFriendHook} from '../use-profile-friend.hook';
import FriendButton from './friend-button.component';
import {useStyles} from './header.style';
import RespondFriendButton from './respond-button.component';

import DialogTitle from 'src/components/common/DialogTitle.component';
import ShowIf from 'src/components/common/show-if.component';
import {SocialListComponent} from 'src/components/user/social-list.component';
import {acronym} from 'src/helpers/string';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {FriendStatus} from 'src/interfaces/friend';
import {ExtendedUser} from 'src/interfaces/user';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type ProfileHeaderProps = {
  isAnonymous: boolean;
  profile: ExtendedUser;
  loading: boolean;
  isGuest: boolean;
};

const ProfileHeaderComponent: React.FC<ProfileHeaderProps> = ({isAnonymous, profile, isGuest}) => {
  const style = useStyles();

  const {friendStatus, makeFriend, checkFriendStatus, cancelFriendRequest, toggleRequest} =
    useFriendHook();
  const {showAlert} = useAlertHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  useEffect(() => {
    checkFriendStatus(profile.id);
  }, [profile.id]);

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
    makeFriend(profile);
  };

  const handleUnFriendRequest = () => {
    if (friendStatus) cancelFriendRequest(friendStatus);
    toggleRemoveAlert();
  };

  const handleApproveFriendRequest = () => {
    if (friendStatus) toggleRequest(friendStatus, FriendStatus.APPROVED);
  };

  const handleRejectFriendRequest = () => {
    if (friendStatus) toggleRequest(friendStatus, FriendStatus.REJECTED);
  };

  // PUBLICKEY;
  const handleAlert = () => {
    showAlert({
      message: 'PublicKey copied!',
      severity: 'success',
      title: 'Success',
    });
  };

  // Handle LOGOUT
  const handleSignOut = async () => {
    await firebaseCloudMessaging.removeToken();
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      redirect: true,
    });
  };

  return (
    <div className={style.root}>
      <div className={style.header}>
        <div style={{width: 500}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Avatar className={style.avatar} src={profile.profilePictureURL}>
              {acronym(profile.name || '')}
            </Avatar>
            <Typography className={style.name}>{profile.name || ''}</Typography>
          </div>
          <div style={{marginTop: '24px'}}>
            <Typography variant="body1" className={style.subtitle}>
              Bio
            </Typography>
            <Typography variant="body2" style={{fontWeight: 400, fontSize: 16, marginTop: 8}}>
              {profile.bio || profileInfo}
            </Typography>
          </div>
          <div style={{marginTop: '24px'}}>
            <Typography variant="body1" className={style.subtitle}>
              Public Key
            </Typography>
            <Input
              className={style.input}
              style={{width: 400, border: '1px solid #8629E9'}}
              name="publickey"
              disabled={true}
              defaultValue={encodeAddress(profile.id)}
              inputProps={{'aria-label': 'description'}}
              endAdornment={
                <InputAdornment position="end">
                  <CopyToClipboard text={encodeAddress(profile.id) || ''} onCopy={handleAlert}>
                    <IconButton aria-label="toggle password visibility">
                      <FileCopyIcon />
                    </IconButton>
                  </CopyToClipboard>
                </InputAdornment>
              }
            />
          </div>
          <ShowIf condition={isGuest === true}>
            <div style={{marginTop: '24px'}}>
              <ShowIf
                condition={
                  friendStatus?.status == null || friendStatus.status == FriendStatus.REJECTED
                }>
                <Button
                  disabled={isAnonymous}
                  className={style.button2}
                  style={{marginRight: 24}}
                  color="primary"
                  variant="contained"
                  size="medium"
                  startIcon={<PersonAddIcon />}
                  onClick={handleSendFriendRequest}>
                  Add Friend
                </Button>
              </ShowIf>

              <ShowIf
                condition={
                  friendStatus?.status === 'pending' && friendStatus.requestorId == profile.id
                }>
                <div style={{display: 'inline-block', marginRight: 16}}>
                  <RespondFriendButton
                    handleReject={handleRejectFriendRequest}
                    handleApprove={handleApproveFriendRequest}
                  />
                </div>
              </ShowIf>

              <ShowIf
                condition={
                  friendStatus?.status === 'pending' && friendStatus.friendId == profile.id
                }>
                <Button
                  className={style.button2}
                  variant="contained"
                  size="medium"
                  disabled
                  style={{background: 'gray', marginRight: 12, color: 'white'}}>
                  Request sent
                </Button>
              </ShowIf>

              <ShowIf condition={friendStatus?.status === 'approved'}>
                <div style={{display: 'inline-block', marginRight: 16}}>
                  <FriendButton handleUnfriend={toggleRemoveAlert} />
                </div>
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

        <div style={{width: 315}}>
          <ShowIf condition={isGuest === false}>
            <div style={{textAlign: 'right'}}>
              <Button
                className={style.button}
                style={{marginRight: 24}}
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
                style={{marginRight: 8}}
                onClick={handleSignOut}>
                Logout
              </Button>
            </div>
            <div style={{marginTop: '30px'}}>
              <SocialListComponent isAnonymous={isAnonymous} />
            </div>
          </ShowIf>
        </div>
      </div>

      {/* MODAL */}
      {user && <ProfileEditComponent toggleProfileForm={toggleProfileForm} open={openEditModal} />}

      <Dialog open={openRemoveModal} aria-labelledby="no-extension-installed">
        <DialogTitle id="name" onClose={toggleRemoveAlert}>
          Unfriend
        </DialogTitle>
        <DialogContent>
          <div className={style.dialogRoot}>
            <Typography
              className={`${style.subtitle2} ${style.alertMessage}  ${style.center} ${style['m-vertical2']}`}>
              Are you sure want to unfriend{' '}
              <Typography variant="inherit" color="primary" className={style.bold}>
                John Doe
              </Typography>
              ? you will no longer see post from this person
            </Typography>
            <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
              <Button size="large" variant="contained" onClick={toggleRemoveAlert}>
                Cancel
              </Button>
              <Button
                className={style.errorColor}
                size="large"
                variant="contained"
                onClick={handleUnFriendRequest}>
                Unfriend
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeaderComponent;
