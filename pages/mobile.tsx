import React from 'react';

import {GetServerSideProps} from 'next';
import getConfig from 'next/config';
import Head from 'next/head';

import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MyriadFullIcon} from 'src/components/atoms/Icons';
import i18n from 'src/locale';

const {publicRuntimeConfig} = getConfig();

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
      marginBottom: theme.spacing(6),
    },
    title: {
      lineHeight: '22.5px',
      marginBottom: theme.spacing(1),
      fontWeight: 700,
      fontSize: 18,
    },
    subtitle: {
      lineHeight: '20px',
      fontSize: 12,
    },
    mb4: {
      marginBottom: theme.spacing(4),
    },
    mb2: {
      marginBottom: theme.spacing(2),
    },
    polkadot: {
      color: theme.palette.primary.main,
    },
    button: {},
  }),
);

const Mobile: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Head>
        <title>{publicRuntimeConfig.appName}</title>
      </Head>
      <Grid container direction="column" justifyContent="center" alignContent="center">
        <Grid item xs={12} className={style.logo}>
          <MyriadFullIcon />
        </Grid>
        <Grid item xs={12}>
          <Typography className={style.title}>{i18n.t('Mobile.title')}</Typography>
          <Typography className={`${style.subtitle} ${style.mb4}`}>
            {i18n.t('Mobile.subtitle')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={`${style.subtitle} ${style.mb2}`}>
            {i18n.t('Mobile.subtitle_2')}&nbsp;
            <Link
              href="https://polkadot.js.org/extension"
              target="_blank"
              className={style.polkadot}>
              Polkadot.js
            </Link>
          </Typography>
        </Grid>

        <Grid item>
          <Button
            href="https://www.myriad.social/"
            className={style.button}
            variant="contained"
            color="primary">
            {i18n.t('Mobile.button_label')}
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
    const UAParser = eval('require("ua-parser-js")');
    const parser = new UAParser();
    const device = parser.setUA(headers['user-agent']).getDevice();

    if (device.type !== 'mobile') {
      return {
        redirect: {
          destination: '/home',
          permanent: false,
          headers,
        },
      };
    }
  }

  return {
    props: {},
  };
};

export default Mobile;
