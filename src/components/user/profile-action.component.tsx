import React, { useState } from 'react';

import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import ShowIf from '../common/show-if.component';
import LoginComponent from '../login/login.component';

import { ProfileEditComponent } from 'src/components/profile/profile-edit.component';
import { User } from 'src/interfaces/user';

const useStyles = makeStyles({
  root: {}
});

type ProfileActionProps = {
  anonymous: boolean;
  user?: User;
};

export const ProfileActionComponent: React.FC<ProfileActionProps> = ({ anonymous, user }) => {
  const styles = useStyles();

  const router = useRouter();
  const [loginOpened, openLogin] = useState(false);

  const toggleLogin = () => {
    openLogin(!loginOpened);
  };

  const viewProfile = () => {
    if (!user) return;

    router.push(`/${user.id}`);
  };

  return (
    <div className={styles.root}>
      <ShowIf condition={anonymous}>
        <Button disableRipple={true} disableFocusRipple={true} variant="contained" size="medium">
          Get a name, Login or Register
        </Button>
      </ShowIf>

      {user && (
        <>
          <ProfileEditComponent user={user} />
          <Button disableRipple={true} disableFocusRipple={true} variant="contained" size="medium" onClick={viewProfile}>
            View Profile
          </Button>
        </>
      )}

      <Dialog open={loginOpened} onClose={toggleLogin} maxWidth="xs">
        <LoginComponent allowAnonymous={false} />
      </Dialog>
    </div>
  );
};
