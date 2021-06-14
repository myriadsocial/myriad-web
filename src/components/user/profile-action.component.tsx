import React from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import ShowIf from '../common/show-if.component';

import { CreateAccountComponent } from 'src/components/login/create-account.component';

const useStyles = makeStyles({
  root: {}
});

type ProfileActionProps = {
  anonymous: boolean;
  userId: string | null;
  onEditProfileClicked: () => void;
  onLoginCliked: () => void;
};

export const ProfileActionComponent: React.FC<ProfileActionProps> = ({ anonymous, userId, onEditProfileClicked, onLoginCliked }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <ShowIf condition={anonymous}>
        <CreateAccountComponent />
      </ShowIf>

      {!anonymous && (
        <>
          <Button
            disableRipple={true}
            disableFocusRipple={true}
            variant="contained"
            size="medium"
            color="primary"
            onClick={onEditProfileClicked}>
            Edit Profile
          </Button>

          <Link href={`/${userId}`}>
            <Button disableRipple={true} disableFocusRipple={true} variant="contained" size="medium" color="primary">
              View Profile
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
