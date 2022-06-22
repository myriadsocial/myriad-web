import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {useMediaQuery, useTheme} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MyriadFullIcon} from 'components/atoms/Icons';
import i18n from 'src/locale';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#FFF',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      [theme.breakpoints.up('xs')]: {
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '1.48vw',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: '#FFC857',
        },
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 18,
        borderLeft: 0,
        padding: '0 20px',
      },
    },
    logo: {
      marginBottom: 32,
    },
    illustration: {
      marginBottom: 16,
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
      [theme.breakpoints.down('xs')]: {
        fontSize: 18,
        lineHeight: '140%',
        fontWeight: 600,
        color: '#0A0A0A',
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
      [theme.breakpoints.down('xs')]: {
        marginBottom: 24,
        lineHeight: '19.6px',
      },
    },
  }),
);

const NotFound: React.FC = () => {
  const style = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={style.root}>
      <div className={style.logo}>
        <MyriadFullIcon />
      </div>
      <div className={style.illustration}>
        <Image
          src="/images/illustration/404.png"
          alt={i18n.t('404.Title')}
          width={isMobile ? 320 : 372}
          height={isMobile ? 240 : 280}
          quality={100}
        />
      </div>
      <Typography className={style.title}>{i18n.t('404.Title')}</Typography>
      <Typography className={style.subtitle}>{i18n.t('404.Subtitle')}</Typography>
      <Link href="/" passHref prefetch={false}>
        <Button component="a" variant="contained" color="primary">
          {i18n.t('404.Btn_Back')}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
