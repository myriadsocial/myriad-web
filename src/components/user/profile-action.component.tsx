import React from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

import ShowIf from '../common/show-if.component';

import Logout from 'src/components/logout/logout.component';

const useStyles = makeStyles({
  root: {},
});

type ProfileActionProps = {
  anonymous: boolean;
  userId: string | null;
  onEditProfileClicked: () => void;
  onLoginClicked: () => void;
};

export const ProfileActionComponent: React.FC<ProfileActionProps> = ({
  anonymous,
  userId,
  onEditProfileClicked,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <ShowIf condition={anonymous}>
        <Logout isAnonymous={anonymous} />
      </ShowIf>

      {!anonymous && (
        <>
          <Button
            id="#edit-profile"
            disableRipple={true}
            disableFocusRipple={true}
            variant="contained"
            size="medium"
            color="primary"
            onClick={onEditProfileClicked}>
            Edit Profile
          </Button>

          <Link href={`/${userId}`}>
            <Button
              id="#view-profile"
              disableRipple={true}
              disableFocusRipple={true}
              variant="contained"
              size="medium"
              color="primary">
              View Profile
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
