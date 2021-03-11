import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createStyles, Theme, makeStyles, lighten } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import LoginMethod from './login-method.component';

import JsonIcon from '../../images/json-icon.svg';
import KeyIcon from '../../images/key-icon.svg';
import PassPhraseIcon from '../../images/passphrase-icon.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.primary.light,
      padding: '15px 29px',
      color: '#E0E0E0',
      flex: '0 0 100%',
      width: 320
    },
    title: {
      paddingBottom: 10,
      borderBottom: '5px solid',
      borderBottomColor: theme.palette.secondary.main
    },
    action: {
      marginTop: 25
    },
    button: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      textTransform: 'none'
    },
    buttonIcon: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      '&& .MuiButton-label': {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: '60%'
      }
    },
    lightButton: {
      marginBottom: 10,
      backgroundColor: lighten('#E849BD', 0.3),
      textAlign: 'left',
      borderRadius: 20
    }
  })
);

export default function LoginComponent() {
  const classes = useStyles();
  const router = useRouter();

  const [shouldShowLoginMethod, showLoginMethod] = React.useState(false);
  const [credential, storeCredential] = React.useState({
    method: '',
    value: ''
  });

  const toggleLogin = (method: string | null) => {
    if (method) {
      storeCredential({
        method,
        value: ''
      });
      showLoginMethod(true);
    } else {
      showLoginMethod(false);
    }
  };

  const saveData = data => {
    showLoginMethod(false);
    storeCredential({
      method: credential.method,
      value: data
    });
  };

  const login = () => {
    router.push('/home');
  };

  return (
    <>
      <Paper className={classes.paper} variant="elevation" elevation={2}>
        <Grid item>
          <Typography className={classes.title} component="h1" variant="h4">
            Log in
          </Typography>
          <div className={classes.action}>
            <ButtonGroup orientation="vertical" fullWidth>
              <Button
                onClick={() => toggleLogin('passphrase')}
                className={classes.buttonIcon}
                color="default"
                size="large"
                fullWidth={true}
                variant="contained"
                startIcon={<PassPhraseIcon />}>
                Passphrase
              </Button>
              <Button
                onClick={() => toggleLogin('json')}
                className={classes.buttonIcon}
                color="default"
                size="large"
                fullWidth={true}
                variant="contained"
                startIcon={<JsonIcon />}>
                JSON
              </Button>
              <Button
                onClick={() => toggleLogin('key')}
                className={classes.buttonIcon}
                color="default"
                size="large"
                fullWidth={true}
                variant="contained"
                startIcon={<KeyIcon />}>
                Private Key
              </Button>
              <Button className={classes.button} color="default" size="large" variant="contained" fullWidth={true}>
                Remind me how this works again?
              </Button>
            </ButtonGroup>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.action}>
            <Button color="secondary" fullWidth={true} size="large" variant="contained" onClick={login}>
              Create A New Account
            </Button>
            <Button className={classes.lightButton} fullWidth={true} size="large" variant="contained">
              <Link href="/anonym">
                <a> Get In Anonymously</a>
              </Link>
            </Button>
          </div>
        </Grid>
      </Paper>

      <LoginMethod show={shouldShowLoginMethod} method={credential.method} onSave={saveData} onCancel={() => toggleLogin(null)} />
    </>
  );
}
