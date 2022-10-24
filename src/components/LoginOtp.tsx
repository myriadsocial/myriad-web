import React, {useState} from 'react';
import OtpInput from 'react-otp-input';

import {Button, Typography} from '@material-ui/core';

import styles from './LoginOtp.module.css';
import {useStyles} from './LoginOtp.style';

const LoginOtp = () => {
  const classes = useStyles();

  const [email] = useState('husni@blocksphere.id');
  const [otp, setOtp] = useState<string[]>('');

  const handleChange = newValue => {
    setOtp(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.title}>
          <Typography variant="h3">{'Magic Link and OTP have been sent!'}</Typography>
        </div>
        <div className={classes.subtitle}>
          <Typography variant="body">
            Click the OTP that we have sent to <b>{email}</b> and input it right here to sign in
          </Typography>
        </div>

        <div style={{margin: '12px 0px'}}>
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={6}
            containerStyle={styles.container}
            inputStyle={styles.otpInput}
          />
        </div>

        <Button variant="contained" fullWidth color="primary" onClick={console.log('connected')}>
          {'Resend Code'}
        </Button>
        <Button variant="outlined" fullWidth color="secondary" onClick={console.log('back')}>
          {'Back'}
        </Button>
      </div>
    </div>
  );
};

export default LoginOtp;
