import React from 'react';
import {useNavigate} from 'react-router-dom';

import {Button, Typography} from '@material-ui/core';

import {useStyles} from './Login.style';

type LoginProps = {
  anonymousLogin: () => void;
};

export const Login: React.FC<LoginProps> = props => {
  const styles = useStyles();
  const navigate = useNavigate();

  const {anonymousLogin} = props;

  const chooseWallet = () => {
    navigate('/wallet');
  };

  return (
    <div className={styles.root}>
      <Button className={styles.button} color="default" variant="contained" onClick={chooseWallet}>
        Sign in
      </Button>
      <Typography className={styles.span} component="span" variant="h4" color="textPrimary">
        Or try our&nbsp;
        <Button className={styles.link} onClick={anonymousLogin} component="span">
          demo
        </Button>
        &nbsp;first&nbsp;
        <span role="img" aria-label="emoticon-peace">
          ✌️
        </span>
      </Typography>

      <Typography component="span" variant="h5">
        To access Myriad, you need to use{' '}
        <a
          href={'https://polkadot.js.org/extension/'}
          className={styles.polkadotLink}
          target="_blank"
          rel="noreferrer">
          Polkadot.js
        </a>
        , on your browser{' '}
        <span role="img" aria-label="emoticon-computer">
          💻
        </span>
      </Typography>
    </div>
  );
};
