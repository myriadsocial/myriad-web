import React, { useState } from 'react';

import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import ShowIf from '../common/show-if.component';

import { LoginFormComponent } from 'src/components/login/login-form.component';
import { ProfileEditComponent } from 'src/components/profile/profile-edit.component';
import { ExtendedUser } from 'src/interfaces/user';

const useStyles = makeStyles({
  root: {}
});

type ProfileActionProps = {
  anonymous: boolean;
  user?: ExtendedUser;
};

export const ProfileActionComponent: React.FC<ProfileActionProps> = ({ anonymous, user }) => {
  const styles = useStyles();

  const router = useRouter();
  const [loginOpened, openLogin] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleLogin = () => {
    openLogin(!loginOpened);
  };

  const toggleProfileForm = () => {
    setOpen(!open);
  };

  const viewProfile = () => {
    if (!user) return;

    router.push(`/${user.id}`);
  };

  return (
    <div className={styles.root}>
      <ShowIf condition={anonymous}>
        <Button disableRipple={true} disableFocusRipple={true} variant="contained" size="medium" color="primary">
          Get a name, Login or Register
        </Button>
      </ShowIf>

      {user && (
        <>
          <Button
            disableRipple={true}
            disableFocusRipple={true}
            variant="contained"
            size="medium"
            color="primary"
            onClick={toggleProfileForm}>
            Edit Profile
          </Button>
          <ProfileEditComponent toggleProfileForm={toggleProfileForm} open={open} user={user} />
          <Button disableRipple={true} disableFocusRipple={true} variant="contained" size="medium" color="primary" onClick={viewProfile}>
            View Profile
          </Button>
        </>
      )}

      <Dialog open={loginOpened} onClose={toggleLogin} maxWidth="xs">
        <LoginFormComponent />
      </Dialog>
    </div>
  );
};
