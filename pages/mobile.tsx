import React from 'react';

import {GetServerSideProps} from 'next';

import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Logo from 'src/images/Myriad_Full_Logo_Color_1-01_1.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      background: '#FFF',
      height: '100vh',
      paddingTop: 60,
      paddingLeft: 46,
      paddingRight: 46,
      textAlign: 'center',
      borderBottom: '40px solid #FFC857',
    },
    logo: {
      marginBottom: 86,
    },
    title: {
      lineHeight: '22.5px',
      marginBottom: 12,
      fontWeight: 700,
      fontSize: 18,
    },
    subtitle: {
      lineHeight: '20px',
      fontSize: 12,
      marginBottom: 60,
    },
    polkadot: {
      color: 'rgb(255, 140, 0)',
    },
    button: {},
  }),
);

const Mobile: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Grid container direction="column" justifyContent="center" alignContent="center">
        <Grid item xs={12} className={style.logo}>
          <Logo />
        </Grid>
        <Grid item xs={12}>
          <Typography className={style.title}>We are truly sorry</Typography>
          <Typography className={style.subtitle}>
            Signing in mobile is currently not available
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={style.subtitle}>
            To access Myriad, you need to use desktop browser and install&nbsp;
            <Link
              href="https://polkadot.js.org/extension"
              target="_blank"
              className={style.polkadot}>
              Polkadot.js
            </Link>
            &nbsp;
            <span role="img" aria-label="desktop">
              💻
            </span>
          </Typography>
        </Grid>

        <Grid item>
          <Button
            href="https://www.myriad.social/"
            className={style.button}
            variant="contained"
            color="primary">
            Visit Myriad Social
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const {req} = context;
  const {headers} = req;

  if (typeof window === 'undefined' && headers['user-agent']) {
    const DeviceDetect = eval('require("node-device-detector")');
    const device = new DeviceDetect();
    const {
      device: {type},
    } = device.detect(context.req.headers['user-agent']);

    if (type === 'desktop') {
      return {
        redirect: {
          destination: '/home',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};

export default Mobile;
