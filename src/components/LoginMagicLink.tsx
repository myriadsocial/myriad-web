import React, {useState} from 'react';

import {Button, Typography} from '@material-ui/core';

import {useStyles} from './LoginOtp.style';

import i18n from 'src/locale';

const LoginMagicLink = () => {
  //TODO: create hook to login using OTP
  //handle when error logging in with OTP

  const classes = useStyles();

  const [email] = useState('husni@blocksphere.id');

  const time = 200;

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.title}>
          <Typography variant="h3">{i18n.t('Login.Magic_Link.Title')}</Typography>
        </div>
        <div className={classes.subtitle}>
          <Typography variant="body1">
            {i18n.t('Login.Magic_Link.Subtitle_1')}
            <b>{email}</b>
          </Typography>
          <Typography variant="body1">{i18n.t('Login.Magic_Link.Subtitle_2')}</Typography>
        </div>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={() => console.log('resend code')}>
          {i18n.t('Login.Magic_Link.Button_Text', {time})}
        </Button>

        <div className={classes.subtitle}>
          <Typography variant="body1">{i18n.t('Login.Magic_Link.Timer_Text')}</Typography>
        </div>
      </div>
    </div>
  );
};

export default LoginMagicLink;
