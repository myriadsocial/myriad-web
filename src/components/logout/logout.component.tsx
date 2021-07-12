import React from 'react';

import { signOut } from 'next-auth/client';

import Button from '@material-ui/core/Button';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { unsubscribeFromAccounts } from '../../helpers/extension';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 15,
      fontSize: 12,
      textTransform: 'none'
    }
  })
);

interface Props {
  isAnonymous?: boolean;
}

export default function Logout({ isAnonymous }: Props) {
  const styles = useStyles();

  const handleSignOut = async () => {
    if (isAnonymous === false) {
      await unsubscribeFromAccounts();
    }
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      redirect: true
    });
  };

  return (
    <Button className={styles.button} size="medium" variant="outlined" color="secondary" onClick={() => handleSignOut()}>
      Logout
    </Button>
  );
}
