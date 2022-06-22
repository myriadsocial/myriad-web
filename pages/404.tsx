import React from 'react';

import Image from 'next/image';

import {useMediaQuery, useTheme} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {MyriadFullIcon} from 'components/atoms/Icons';
import {useStyles} from 'src/components/Error/Error.style';
import i18n from 'src/locale';

const NotFound: React.FC = () => {
  const style = useStyles({});

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

      <Button component="a" href="/home" variant="contained" color="primary">
        {i18n.t('404.Btn_Back')}
      </Button>
    </div>
  );
};

export default NotFound;
