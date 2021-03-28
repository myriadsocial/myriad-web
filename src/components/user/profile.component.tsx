import React from 'react';

import { useSession } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ShowIf from '../common/show-if.component';
import { useStyles } from './profile.style';

type Props = {
  loggedIn?: boolean;
  toggleLogin: (open: boolean) => void;
};

const Profile = ({ toggleLogin }: Props) => {
  const styles = useStyles();
  const [session] = useSession();

  return (
    <div className={styles.root}>
      <Avatar className={styles.avatar} src="/images/avatar/3.jpg">
        Anonimous
      </Avatar>
      <div className={styles.info}>
        <Typography className={styles.name}>{session?.user.name}</Typography>

        <ShowIf condition={!session?.user.anonymous}>
          <Button className={styles.button} size="small" variant="contained" color="primary">
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
    </div>
  );
};

export default Profile;
