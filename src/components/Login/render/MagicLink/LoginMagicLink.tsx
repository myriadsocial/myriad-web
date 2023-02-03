import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {useStyles} from '../../../LoginMagicLink.style';

import {useAuthLinkHook} from 'src/hooks/auth-link.hook';
import i18n from 'src/locale';

type LoginMagicLinkProps = {
  email: string;
};

const LoginMagicLink = ({email = ''}: LoginMagicLinkProps) => {
  const [userEmail] = useState(email);

  const {requestLink} = useAuthLinkHook();

  const classes = useStyles();

  const COOLDOWN_TIME = 60;

  const [countDown, setCountDown] = useState(COOLDOWN_TIME);
  const router = useRouter();
  const navigate = useNavigate();
  const browserTabcloseHandler = e => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    if (window) {
      router.beforePopState(() => {
        const result = window.confirm('are you sure you want to leave?');
        if (result) {
          window.history.pushState('/login', '');
          navigate('/email');
        } else {
        }
        return false;
      });
      window.onbeforeunload = browserTabcloseHandler;
    }

    return () => {
      if (window) {
        window.onbeforeunload = null;
      }
      router.beforePopState(() => {
        return true;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (countDown > 0) {
      const interval = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countDown]);

  const handleRequestLink = async () => {
    try {
      const message = await requestLink(userEmail);

      if (message.length) {
        setCountDown(COOLDOWN_TIME);
      }
    } catch (error) {
      console.log({error});
    }
  };

  useEffect(() => {
    localStorage.setItem('email', userEmail);
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.title}>
          <Typography variant="h3">{i18n.t('Login.Magic_Link.Title')}</Typography>
        </div>
        <div className={classes.subtitle}>
          <Typography variant="body1">
            {i18n.t('Login.Magic_Link.Subtitle_1')}
            <b>{userEmail}</b>
          </Typography>
          <Typography variant="body1">
            {i18n.t('Login.Magic_Link.From')} <b>no-reply@myriad.systems</b>.
          </Typography>
          <Typography variant="body1">{i18n.t('Login.Magic_Link.Subtitle_2')}</Typography>
        </div>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          disabled={countDown > 0}
          onClick={() => handleRequestLink()}>
          {i18n.t('Login.Magic_Link.Button_Text')}
        </Button>

        <div className={classes.subtitle}>
          <Typography variant="body1">
            {i18n.t('Login.Magic_Link.Timer_Text', {time: countDown})}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default LoginMagicLink;
