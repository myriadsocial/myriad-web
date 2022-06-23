import React from 'react';

import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';

import {useMediaQuery, useTheme} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from 'src/components/Error/Error.style';
import {MyriadFullIcon} from 'src/components/atoms/Icons';
import i18n from 'src/locale';

const Maintenance: React.FC = () => {
  const style = useStyles({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const {publicRuntimeConfig} = getConfig();

  return (
    <div className={style.root}>
      <Head>
        <title>{i18n.t('Maintenance.Title_Head', {appname: publicRuntimeConfig.appName})}</title>
      </Head>

      <div className={style.logo}>
        <MyriadFullIcon />
      </div>
      <div className={style.illustration}>
        <Image
          src="/images/illustration/maintenance.png"
          alt={i18n.t('Maintenance.Title')}
          width={isMobile ? 320 : 372}
          height={isMobile ? 240 : 280}
          quality={100}
        />
      </div>
      <Typography className={style.title}>{i18n.t('Maintenance.Title')}</Typography>
      <Typography className={style.subtitle}>{i18n.t('Maintenance.Subtitle')}</Typography>
      <Button
        component="a"
        href="https://www.myriad.social"
        target="_blank"
        variant="contained"
        color="primary">
        {i18n.t('Maintenance.Btn_Web')}
      </Button>
    </div>
  );
};

export default Maintenance;
