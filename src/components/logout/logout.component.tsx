import React from 'react';

import {signOut} from 'next-auth/client';

import Button from '@material-ui/core/Button';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

import {unsubscribeFromAccounts} from '../../helpers/extension';
import {firebaseCloudMessaging} from '../../lib/firebase';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 15,
      fontSize: 14,
      fontWeight: 'normal',
      textTransform: 'none',
    },
  }),
);

interface LogoutProps {
  isAnonymous?: boolean;
}

export const LogoutComponent: React.FC<LogoutProps> = ({isAnonymous}) => {
  const styles = useStyles();

  const handleSignOut = async () => {
    if (isAnonymous === false) {
      await unsubscribeFromAccounts();
      await firebaseCloudMessaging.removeToken();
    }
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      redirect: true,
    });
  };

  return (
    <Button
      className={styles.button}
      variant="outlined"
      color="secondary"
      onClick={() => handleSignOut()}
      fullWidth>
      Logout
    </Button>
  );
};

export default LogoutComponent;
