import {ArrowsExpandIcon, ExternalLinkIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';

import {Link} from '@material-ui/core';
import {Typography, IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {useStyles} from './town.style';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
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
        <div className={style.containerFooter}>
          <Link
            href="https://myriad.town/"
            target="_blank"
            style={{color: 'rgb(255, 140, 0)', textDecoration: 'none'}}>
            <IconButton className={`${style.btnVisit} ${style.mr5}`} color="primary">
              <SvgIcon
                className={style.mr1}
                classes={{root: style.fill}}
                component={ExternalLinkIcon}
                viewBox="0 0 24 24"
              />
              <Typography color="primary">{i18n.t('Myriad_Town.Visit')}</Typography>
            </IconButton>
          </Link>
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
