import React, {useState, useEffect} from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

import {useAuthHook} from 'src/hooks/auth.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 678,
      height: 445,
      background:
        'linear-gradient(117.69deg, rgba(112, 112, 112, 0.2) 60.66%, rgba(203, 203, 203, 0) 114.57%)',
      backdropFilter: 'blur(24px)',
      /* Note: backdrop-filter has minimal browser support */
      borderColor: '#696969',
      borderRadius: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '27px 22px 30px',
      marginBottom: 42,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: theme.spacing(3),
      color: theme.palette.text.secondary,
    },
    form: {
      width: 444,
      marginBottom: theme.spacing(5),
    },
    username: {
      marginBottom: theme.spacing(0.5),

      '& .MuiFormHelperText-root': {
        marginTop: 4,
        fontSize: 14,
        fontWeight: 400,
        marginLeft: 0,
      },
    },
    tutorial: {
      padding: theme.spacing(1),
      textAlign: 'center',
      maxWidth: 370,
      marginLeft: 'auto',
      marginRight: 'auto',
      textDecoration: 'underline',
      fontSize: 16,
      fontWeight: 600,
    },
    help: {
      padding: theme.spacing(1),
      textAlign: 'center',
      maxWidth: 370,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 14,
      color: theme.palette.text.secondary,
      textDecoration: 'underline',
    },
    signIn: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      fontSize: 16,
      fontWeight: 600,
    },
    action: {
      flexWrap: 'wrap',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      height: 48,
      '& .MuiButton-root': {
        width: 300,
        fontSize: 14,
        fontWeight: 600,
        marginRight: theme.spacing(3),
        '&:last-child': {
          marginRight: 0,
        },
      },
    },
    anonymous: {
      background: theme.palette.text.secondary,
      color: '#2998E9',
    },
    register: {
      background: '#2998E9',
      color: theme.palette.text.secondary,
    },
    info: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',

      '& .MuiCard-root': {
        width: 445,
      },
    },

    polkadot: {
      color: 'rgb(255, 140, 0)',
    },
  }),
);

type LoginComponentProps = {};

export const LoginFormComponent: React.FC<LoginComponentProps> = props => {
  const style = useStyles();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {login, anonymous} = useAuthHook();
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    checkExtensionInstalled();
  }, []);

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setExtensionInstalled(installed);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const signIn = () => {
    setSubmitted(true);

    const valid = username && username.length >= 6;

    if (!extensionInstalled || !valid) {
      return;
    }

    login(username);
  };

  return (
    <div className={style.root}>
      <Typography variant="h1" className={style.title}>
        Sign In
      </Typography>
      <form noValidate autoComplete="off" className={style.form}>
        <FormControl className={style.username} fullWidth>
          <TextField
            id="username"
            onChange={handleNameChange}
            error={submitted && username.length < 6}
            helperText={
              submitted && username.length < 6
                ? 'Username must be filled and has 6 character or more'
                : ''
            }
            fullWidth
            hiddenLabel
            name="username"
            placeholder="Username"
            variant="outlined"
            color="secondary"
            margin="dense"
            type="text"
          />

          <Typography variant="body1" className={style.tutorial}>
            <Link href="#">How it works?</Link>
          </Typography>
        </FormControl>

        <Button
          onClick={signIn}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          className={style.signIn}>
          Sign in
        </Button>

        <Typography variant="body1" className={style.help}>
          Make sure you already have <span className={style.polkadot}>Polkadot.js</span> extension
          installed on your browser
        </Typography>
      </form>

      <div className={style.action}>
        <Button className={style.anonymous} variant="contained" size="large" onClick={anonymous}>
          Anonymous Login
        </Button>
        <Link href="/register">
          <a href="/register">
            <Button className={style.register} variant="contained" size="large">
              Create Account
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};
