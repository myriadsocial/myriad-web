import {Typography} from '@material-ui/core';

import {useStyles} from './LoginByEmail.style';

import i18n from 'src/locale';

const LoginByEmail = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Typography className={styles.title}>{i18n.t('Login.Email.LoginByEmail.Title')}</Typography>
      <Typography className={styles.subtitle}>
        {i18n.t('Login.Email.LoginByEmail.Subtitle')}
      </Typography>
      <div>
        <div>this is login by email card</div>
      </div>
    </div>
  );
};

export default LoginByEmail;
