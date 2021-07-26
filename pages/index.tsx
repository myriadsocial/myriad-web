import React, {useEffect} from 'react';

import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import AlertComponent from 'src/components/alert/Alert.component';
import {LoginInfoComponent} from 'src/components/login/login-info.component';
import {LoginComponent} from 'src/components/login/login.component';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import LogoImage from 'src/images/myriad-logo.svg';
import {healthcheck} from 'src/lib/api/healthcheck';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // background: 'linear-gradient(110.43deg, #A942E9 0%, rgba(255, 255, 255, 0) 100.48%), #FFFFFF',
      minHeight: '100vh',
      backgroundImage: 'url(/images/login-background.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      display: 'flex',
      flexWrap: 'wrap',
    },
    header: {
      textAlign: 'center',
    },
    logo: {
      marginTop: 48,
      height: 87,
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: '30px',
      marginBottom: 59,
      color: theme.palette.background.paper,
    },
    titlePrimary: {
      color: theme.palette.primary.main,
    },
    login: {
      marginTop: 140,
      width: 320,
      marginRight: 65,
    },
  }),
);

export default function Index() {
  const style = useStyles();

  const {query} = useRouter();
  const {showAlert} = useAlertHook();

  useEffect(() => {
    if (query.error) {
      showAlert({
        message: 'Something wrong when try to loggedin.',
        severity: 'error',
        title: 'Login failed',
      });
    }
  }, [query.error]);

  return (
    <div className={style.root}>
      <Grid container direction="column" alignItems="center">
        <div className={style.header}>
          <LogoImage className={style.logo} />
          <Typography variant="h1" className={style.title}>
            Social Media with <span className={style.titlePrimary}>no boundaries</span>
          </Typography>
        </div>

        <LoginComponent />

        <LoginInfoComponent />
      </Grid>

      <AlertComponent />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {res} = context;

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
    props: {},
  };
};
