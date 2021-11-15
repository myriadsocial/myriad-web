import React, {useEffect} from 'react';

import {GetServerSideProps} from 'next';
import {useSession, getSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import AlertComponent from 'src/components/alert/Alert.component';
import {RegisterFormComponent} from 'src/components/register/register-form.component';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import LogoImage from 'src/images/header-logo.svg';
import {healthcheck} from 'src/lib/api/healthcheck';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // background: 'linear-gradient(110.43deg, #A942E9 0%, rgba(255, 255, 255, 0) 100.48%), #FFFFFF',
      minHeight: '100vh',
      backgroundImage: 'url(/images/login-background.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
    header: {
      textAlign: 'center',
    },
    logo: {
      marginTop: 64,
      height: 56,
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: '30px',
      marginBottom: 40,
      color: theme.palette.text.secondary,
    },
    login: {
      marginTop: 140,
      width: 320,
      marginRight: 65,
    },
    timeline: {},
  }),
);

export default function Index() {
  const style = useStyles();

  const [session, loading] = useSession();
  const router = useRouter();
  const {showAlert} = useAlertHook();

  useEffect(() => {
    if (session && !loading) {
      router.push('/home');
    }
  }, [loading, session]);

  useEffect(() => {
    if (router.query.error) {
      showAlert({
        message: 'Something went wrong when trying to log in.',
        severity: 'error',
        title: 'Login failed',
      });
    }
  }, [router.query.error]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  return (
    <div className={style.root}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={style.header}>
          <LogoImage className={style.logo} />
          <Typography variant="h1" className={style.title}>
            Social Media with no boundaries
          </Typography>
        </Grid>
        <Grid item className={style.timeline}>
          <RegisterFormComponent />
        </Grid>
      </Grid>

      <AlertComponent />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {res} = context;

  if (typeof window === 'undefined') {
    const DeviceDetect = eval('require("node-device-detector")');

    const device = new DeviceDetect();
    const {
      device: {type},
    } = device.detect(context.req.headers['user-agent']);

    if (type === 'smartphone') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers: context.req.headers,
        },
      };
    }
  }

  const available = await healthcheck();

  if (!available) {
    res.setHeader('location', '/maintenance');
    res.statusCode = 302;
    res.end();
  }

  const session = await getSession(context);

  if (session) {
    res.setHeader('location', '/home');
    res.statusCode = 302;
    res.end();
  }

  return {
    props: {
      session,
    },
  };
};
