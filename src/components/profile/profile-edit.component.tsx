import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { signOut } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { useProfileHook } from './use-profile.hook';

import { useAlertHook } from 'src/components/alert/use-alert.hook';
import DialogTitle from 'src/components/common/DialogTitle.component';
import { EditableTextField } from 'src/components/common/EditableTextField';
import { ImageUpload } from 'src/components/common/ImageUpload.component';
import { acronym } from 'src/helpers/string';
import { User } from 'src/interfaces/user';

const useStyles = makeStyles({
  root: {},
  detail: {
    position: 'relative'
  },
  profileContent: {
    width: 500,
    marginTop: 40
  },
  avatarBig: {
    height: 90,
    width: 90,
    position: 'absolute',
    top: 140
  },
  media: {
    height: 0,
    paddingTop: '34.25%'
  },
  actions: {
    justifyContent: 'space-between'
  },
  logout: {
    textAlign: 'center'
  }
});

type ProfileEditProps = {
  user: User;
};

const profileInfo =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae nibh eu tellus tincidunt luctus hendrerit in orci. Phasellus vitae tristique nulla. Nam magna massa, sollicitudin sed turpis eros.';

export const ProfileEditComponent: React.FC<ProfileEditProps> = ({ user }) => {
  const styles = useStyles();

  const [cookie] = useCookies(['seed']);
  const { profile, updateProfile } = useProfileHook(user);
  const { showAlert } = useAlertHook();
  const [open, setOpen] = useState(false);

  const toggleProfileForm = () => {
    setOpen(!open);
  };

  const getProfilePicture = (): string => {
    return user.profilePictureURL || '';
  };

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

  const onMnemonicCopied = () => {
    showAlert({
      severity: 'success',
      title: 'Mnemonic',
      message: ' Mnemonic copied!'
    });
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      redirect: true
    });
  };

  return (
    <>
      <Button disableRipple={true} disableFocusRipple={true} variant="contained" size="medium" color="primary" onClick={toggleProfileForm}>
        Edit Profile
      </Button>

      <Dialog open={open} aria-labelledby="no-extension-installed" maxWidth="sm">
        <DialogTitle id="name" onClose={toggleProfileForm}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Card className={styles.detail}>
            <CardMedia
              className={styles.media}
              image="https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg"
              title={profile?.name || 'Avatar'}
            />

            <CardContent className={styles.profileContent}>
              <ImageUpload
                value={getProfilePicture()}
                preview={
                  <Avatar className={styles.avatarBig} src={getProfilePicture()}>
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

            <CardActions className={styles.actions}>
              <CopyToClipboard text={cookie.uri || ''} onCopy={onMnemonicCopied}>
                <Button size="medium" color="primary" variant="contained" className={styles.logout}>
                  Copy Mnemonic Seed
                  <FileCopyIcon />
                </Button>
              </CopyToClipboard>

              <Button size="medium" color="secondary" variant="contained" className={styles.logout} onClick={handleSignOut}>
                Logout
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

ProfileEditComponent.defaultProps = {};
