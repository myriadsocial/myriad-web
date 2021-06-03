import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AlertComponent from 'src/components/alert/Alert.component';
import { useAlertHook } from 'src/components/alert/use-alert.hook';
import { LoginFormComponent } from 'src/components/login/login-form.component';
import { LoginInfoComponent } from 'src/components/login/login-info.component';
import LogoImage from 'src/images/header-logo.svg';
import { healthcheck } from 'src/lib/api/healthcheck';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // background: 'linear-gradient(110.43deg, #A942E9 0%, rgba(255, 255, 255, 0) 100.48%), #FFFFFF',
      padding: '24px 36px',
      minHeight: '100vh',
      backgroundImage: 'url(/images/login-background.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      borderRadius: theme.spacing(1)
    },
    header: {
      textAlign: 'center'
    },
    logo: {
      marginTop: 64,
      height: 56
    },
    title: {
      fontSize: theme.spacing(3),
      fontWeight: 700,
      lineHeight: '30px',
      marginTop: theme.spacing(1.5),
      marginBottom: 46,
      color: theme.palette.text.secondary
    },
    login: {
      marginTop: 140,
      width: 320,
      marginRight: 65
    },
    timeline: {}
  })
);

export default function Index() {
  const style = useStyles();

  const [session, loading] = useSession();
  const router = useRouter();
  const { showAlert } = useAlertHook();

  useEffect(() => {
    if (session && !loading) {
      router.push('/home');
    }
  }, [loading, session]);

  useEffect(() => {
    if (router.query.error) {
      showAlert({
        message: 'Something wrong when try to loggedin.',
        severity: 'error',
        title: 'Login failed'
      });
    }
  }, [router.query.error]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  return (
    <div className={style.root}>
      <Grid container spacing={3} direction="column" alignItems="center">
        <Grid item className={style.header}>
          <LogoImage className={style.logo} />
          <Typography variant="h2" className={style.title}>
            Social Media with no boundary
          </Typography>
        </Grid>
        <Grid item className={style.timeline}>
          <LoginFormComponent />
        </Grid>

        <Grid item className={style.timeline}>
          <LoginInfoComponent />
        </Grid>
      </Grid>

      <AlertComponent />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;

  const available = await healthcheck();

  if (!available) {
    res.writeHead(302, { location: `${process.env.NEXTAUTH_URL}/maintenance` });
    res.end();
  }

  return {
    props: {
      session: await getSession(context)
    }
  };
};
