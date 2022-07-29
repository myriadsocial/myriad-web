import {ArrowsExpandIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';

import {Typography, IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {useStyles} from './town.style';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import InfoIconYellow from 'src/images/Icons/InfoIconYellow.svg';
import i18n from 'src/locale';

const TownContainer: React.FC = () => {
  const style = useStyles();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', handleEsc, false);

    return () => {
      document.removeEventListener('keydown', handleEsc, false);
    };
  }, []);

  const gotoFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    enqueueSnackbar({
      message: i18n.t('Myriad_Town.Toaster_Esc'),
      variant: 'success',
    });
  };

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFullscreen(false);
    }
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <iframe
          src="https://myriad.town/"
          className={isFullscreen ? style.iframeFull : style.iframe}
          allowFullScreen={true}></iframe>
        <div className={style.disclaimer}>
          <div className={style.wrapperIcon}>
            <InfoIconYellow />
          </div>
          <Typography className={style.textWarning} display="inline">
            {i18n.t('Myriad_Town.Disclaimer')}{' '}
            <Typography
              className={style.textWarning}
              component="a"
              target={'_blank'}
              href="https://myriad.town">
              https://myriad.town
            </Typography>
            .
          </Typography>
        </div>
        <div className={style.containerFooter}>
          <IconButton onClick={gotoFullscreen} className={style.btnVisit} color="primary">
            <SvgIcon
              className={style.mr1}
              classes={{root: style.fill}}
              component={ArrowsExpandIcon}
              viewBox="0 0 24 24"
            />
            <Typography color="primary">{i18n.t('Myriad_Town.Fullscreen')}</Typography>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default TownContainer;
