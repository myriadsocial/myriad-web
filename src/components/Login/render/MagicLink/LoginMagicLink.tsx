import {useState, useEffect} from 'react';

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

  useEffect(() => {
    handleRequestLink();
  }, []);

  const classes = useStyles();

  const COOLDOWN_TIME = 30;

  const [countDown, setCountDown] = useState(COOLDOWN_TIME);

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
