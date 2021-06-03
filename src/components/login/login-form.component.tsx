import React from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 678,
      background: 'linear-gradient(117.69deg, rgba(112, 112, 112, 0.2) 60.66%, rgba(203, 203, 203, 0) 114.57%)',
      backdropFilter: 'blur(24px)',
      /* Note: backdrop-filter has minimal browser support */
      borderColor: ' #696969',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 24
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      padding: 24,
      color: theme.palette.text.secondary
    },
    form: {
      width: 444,
      marginBottom: theme.spacing(5)
    },
    username: {
      marginBottom: theme.spacing(0.5)
    },
    help: {
      padding: theme.spacing(1),
      textAlign: 'center',
      maxWidth: 370
    },
    signIn: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1)
    },
    action: {
      flexWrap: 'wrap',
      marginTop: 8,
      marginBottom: 8,
      height: 48,
      '& .MuiButton-root': {
        width: 300,
        marginRight: 24,
        '&:last-child': {
          marginRight: 0
        }
      }
    },
    info: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',

      '& .MuiCard-root': {
        width: 445
      }
    }
  })
);

type Props = {};

export const LoginFormComponent = ({}: Props) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Typography variant="h1" className={style.title}>
        Sign In
      </Typography>
      <form noValidate autoComplete="off" className={style.form}>
        <FormControl className={style.username} fullWidth>
          <TextField id="public_key" autoFocus fullWidth label="Username" variant="outlined" color="secondary" margin="dense" type="text" />

          <Typography variant="body1" className={style.help}>
            <Link href="#">How it works?</Link>
          </Typography>
        </FormControl>

        <Button variant="contained" color="primary" size="large" fullWidth className={style.signIn}>
          Sign In
        </Button>

        <Typography variant="body1" className={style.help}>
          Make sure you already have Polkadot.js extension installed on your browser
        </Typography>
      </form>

      <div className={style.action}>
        <Button variant="contained" color="primary" size="large">
          Anonymous Login
        </Button>
        <Button variant="contained" color="secondary" size="large">
          Create Account
        </Button>
      </div>
    </div>
  );
};
