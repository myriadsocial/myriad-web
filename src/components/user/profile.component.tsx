import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useSession, signOut } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import DialogTitle from '../common/DialogTitle.component';
import ShowIf from '../common/show-if.component';
import { useStyles } from './profile.style';

import { EditableTextField } from 'src/components/common/EditableTextField';
import { ImageUpload } from 'src/components/common/ImageUpload.component';

type Props = {
  loggedIn?: boolean;
  toggleLogin: (open: boolean) => void;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Profile = ({ toggleLogin }: Props) => {
  const styles = useStyles();
  const [session] = useSession();
  const [cookie] = useCookies(['seed']);

  const [isEditProfile, showEditProfile] = useState(false);
  const [isMnemonicCopied, setMnemonicCopied] = useState(false);
  const editProfile = () => {
    showEditProfile(true);
  };

  const closeEditProfile = () => {
    showEditProfile(false);
  };

  const handleSignOut = async () => {
    signOut();
  };

  const onMnemonicCopied = () => {
    setMnemonicCopied(true);
  };

  const closeNotify = () => {
    setMnemonicCopied(false);
  };

  const updateName = (value: string) => {};

  const profileInfo =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae nibh eu tellus tincidunt luctus hendrerit in orci. Phasellus vitae tristique nulla. Nam magna massa, sollicitudin sed turpis eros.';

  return (
    <div className={styles.root}>
      <Avatar className={styles.avatar} src="/images/avatar/3.jpg">
        Anonimous
      </Avatar>
      <div className={styles.info}>
        <Typography className={styles.name}>{session?.user.name}</Typography>

        <ShowIf condition={!session?.user.anonymous}>
          <Button className={styles.button} size="small" variant="contained" color="primary" onClick={editProfile}>
            Edit Your Profile
          </Button>
        </ShowIf>

        <ShowIf condition={!!session?.user.anonymous}>
          <Button
            className={styles.button}
            fullWidth={true}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => toggleLogin(true)}>
            Get a name, Login or Register
          </Button>
        </ShowIf>
      </div>

      <Dialog open={isEditProfile} aria-labelledby="no-extension-installed" maxWidth="sm">
        <DialogTitle id="name" onClose={closeEditProfile}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Card className={styles.detail}>
            <CardMedia
              className={styles.media}
              image="https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg"
              title={session?.user.name || 'Avatar'}
            />

            <CardContent className={styles.profileContent}>
              <ImageUpload value={'/images/avatar/3.jpg'} onSelected={() => console.log}>
                <Avatar className={styles.avatarBig} src="/images/avatar/3.jpg">
                  {session?.user.name}
                </Avatar>
              </ImageUpload>
              <EditableTextField
                name="profile.name"
                value={session?.user.name || ''}
                onChange={updateName}
                fullWidth={true}
                style={{ fontSize: 20 }}
              />

              <EditableTextField name="profile.name" value={profileInfo} onChange={updateName} multiline={true} fullWidth={true} />
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
        <Snackbar open={isMnemonicCopied} autoHideDuration={6000} onClose={closeNotify}>
          <Alert onClose={closeNotify} severity="success">
            Mnemonic copied!
          </Alert>
        </Snackbar>
      </Dialog>
    </div>
  );
};

export default Profile;
