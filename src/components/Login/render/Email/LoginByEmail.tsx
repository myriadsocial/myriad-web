import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';

import {useRouter} from 'next/router';

import {Button, TextField, Typography} from '@material-ui/core';

import {useStyles} from './LoginByEmail.style';

import SelectServer from 'src/components/SelectServer';
import {useAuthLinkHook} from 'src/hooks/auth-link.hook';
import {ServerListProps} from 'src/interfaces/server-list';
import i18n from 'src/locale';
import validator from 'validator';

type LoginByEmailProps = {
  onNext: (successCallback: () => void, failedCallback: () => void, email: string) => Promise<void>;
};

const LoginByEmail = ({onNext}: LoginByEmailProps) => {
  const styles = useStyles();
  const router = useRouter();

  const {requestLink} = useAuthLinkHook();

  const [email, setEmail] = useState('');
  const [error, setError] = useState({
    isError: false,
    message: '',
  });

  useEffect(() => {
    const email = router?.query?.email?.toString() ?? '';
    emailValidation(email);
  }, [router.query.email]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    emailValidation(input);
  };

  const emailValidation = (email: string) => {
    if (!email.length) {
      setError({isError: false, message: ''});
    } else if (!validator.isEmail(email)) {
      setError({
        isError: true,
        message: 'Please enter a valid email!',
      });
    } else {
      setError({
        isError: false,
        message: '',
      });
    }
    setEmail(email);
  };

  const navigate = useNavigate();

  const handleNext = () => {
    onNext(
      () => {
        requestLink(email);
        navigate('/magiclink');
      },
      () => {
        navigate('/createAccounts');
      },
      email,
    );
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSwitchInstance = (server: ServerListProps, callback?: () => void) => {
    callback && callback();
  };

  return (
    <div className={styles.root}>
      <div>
        <Typography className={styles.title}>{i18n.t('Login.Email.LoginByEmail.Title')}</Typography>
        <Typography className={styles.subtitle}>
          {i18n.t('Login.Email.LoginByEmail.Subtitle')}
        </Typography>
      </div>
      <TextField
        fullWidth
        id="user-email-input"
        label="Email"
        variant="outlined"
        placeholder={i18n.t('Login.Email.LoginByEmail.Email_Placeholder')}
        value={email}
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
          disabled={!email.length || error.isError}
          onClick={handleNext}>
          {i18n.t('Login.Email.LoginByEmail.Next')}
        </Button>
      </div>
    </div>
  );
};

export default LoginByEmail;
