import React from 'react';

import {GetServerSideProps} from 'next';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Logo from 'src/images/Myriad_Full_Logo_Color_1-01_1.svg';
import Illustration from 'src/images/undraw_Fall_is_coming_yl0x_1.svg';
import {healthcheck} from 'src/lib/api/healthcheck';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      textAlign: 'center',
      background: '#FFF',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {},
    illustration: {
      marginTop: -30,
    },
    bar: {
      background: '#FFC857',
      position: 'absolute',
      width: '1.48vw',
      height: '100%',
      left: 0,
      top: 0,
    },
    title: {
      lineHeight: '33.6px',
      marginBottom: 20,
      fontWeight: 700,
      fontSize: 28,
      [theme.breakpoints.down(1346)]: {
        marginBottom: 8,
        fontSize: 20,
      },
    },
    subtitle: {
      lineHeight: '25.1px',
      marginBottom: 84,
      fontSize: 20,
      [theme.breakpoints.down(1346)]: {
        marginBottom: 42,
        fontSize: 14,
      },
    },
    button: {},
  }),
);

const Maintenance: React.FC = () => {
  const style = useStyles();

  const handleAction = () => {
    window.open('https://www.myriad.social/', '_ blank');
  };

  return (
    <div className={style.root}>
      <div>
        <div className={style.bar} />
        <div className={style.logo}>
          <Logo />
        </div>
        <div className={style.illustration}>
          <Illustration />
        </div>
        <Typography className={style.title}>Yep there&rsquo;s no one here</Typography>
        <Typography className={style.subtitle}>
          We&rsquo;re currently under maintenance, please comeback latter
        </Typography>
        <Button onClick={handleAction} className={style.button} variant="contained" color="primary">
          Myriad web
        </Button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const {res} = context;

  const available = await healthcheck();

  if (available) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  return {
    props: {},
  };
};

export default Maintenance;
