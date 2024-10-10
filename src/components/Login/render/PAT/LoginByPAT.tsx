import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

import { signIn } from 'next-auth/react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { Button, TextField, Typography } from '@material-ui/core';

import { useStyles } from './LoginByPAT.style';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import SelectServer from 'src/components/SelectServer';
import { useAuthLinkHook } from 'src/hooks/auth-link.hook';
import { useAlertHook } from 'src/hooks/use-alert.hook';
import { ServerListProps } from 'src/interfaces/server-list';
import i18n from 'src/locale';
import validator from 'validator';

type LoginByPATProps = {
  onNext: (
    successCallback: () => void,
    failedCallback: () => void,
    email: string,
  ) => Promise<void>;
};

const LoginByPAT = ({ onNext }: LoginByPATProps) => {
  const styles = useStyles();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
  const { showAlert } = useAlertHook();

  const { requestLink } = useAuthLinkHook();
  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const [token, setToken] = useState('');
  const [error, setError] = useState({
    isError: false,
    message: '',
  });
  const [, setDisableSignIn] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setToken(input);
  };

  const navigate = useNavigate();

  const handleNext = () => {
    signIn('tokenCredentials', {
      token,
      instanceURL: cookies[COOKIE_INSTANCE_URL],
      redirect: false,
      callbackUrl: publicRuntimeConfig.appAuthURL,
    }).then(response => {
      if (response.ok) {
        router.reload();
        router.push('/');
      }

      if (response.error) {
        showAlert({
          message: token
            ? i18n.t('Login.Alert.Invalid_OTP')
            : i18n.t('Login.Alert.Message'),
          severity: 'error',
          title: i18n.t('Login.Alert.Title'),
        });
        setDisableSignIn(false);
      }
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSwitchInstance = (
    server: ServerListProps,
    callback?: () => void,
  ) => {
    callback && callback();
  };

  return (
    <div className={styles.root}>
      <div>
        <Typography className={styles.title}>
          {i18n.t('Login.Email.LoginByEmail.Title')}
        </Typography>
        <Typography className={styles.subtitle}>
          {i18n.t('Login.Email.LoginByEmail.Subtitle')}
        </Typography>
      </div>
      <TextField
        fullWidth
        id="user-email-input"
        label="Token"
        variant="outlined"
        placeholder={i18n.t('Login.Email.LoginByEmail.Email_Placeholder')}
        value={token}
        onChange={handleChange}
        error={error.isError}
        helperText={error.isError ? error.message : ''}
      />
      <SelectServer page="login" onSwitchInstance={handleSwitchInstance} />
      <div className={styles.actionWrapper}>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          {i18n.t('Login.Email.LoginByEmail.Back')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!token.length || error.isError}
          onClick={handleNext}>
          {i18n.t('Login.Email.LoginByEmail.Next')}
        </Button>
      </div>
    </div>
  );
};

export default LoginByPAT;
