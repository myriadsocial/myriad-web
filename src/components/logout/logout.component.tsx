import React from 'react';

import { signOut } from 'next-auth/client';

import Button from '@material-ui/core/Button';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

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

export default function Logout() {
  const styles = useStyles();

  return (
    <Button className={styles.button} size="small" variant="contained" color="secondary" onClick={() => signOut()}>
      Logout
    </Button>
  );
}
