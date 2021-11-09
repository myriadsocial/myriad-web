import {ExclamationCircleIcon} from '@heroicons/react/solid';

import React from 'react';

import getConfig from 'next/config';

import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {version} from '../../../../package.json';
import useStyles from './banner.style';

import ShowIf from 'src/components/common/show-if.component';

type Props = {
  text?: string;
};

const BannerStatusComponent: React.FC<Props> = props => {
  const style = useStyles();
  const [open, setOpen] = React.useState(true);
  const {publicRuntimeConfig} = getConfig();
  const appName = publicRuntimeConfig.appName;
  const appStatus = publicRuntimeConfig.appStatus;
  const {
    text = `You are currently using ${appName} v.${version}, It’s not audited so use it on your own risk!`,
  } = props;

  React.useEffect(() => {
    const status = localStorage.getItem('banner');
    status && setOpen(JSON.parse(status));
  }, []);

  const setHiddenBanner = () => {
    localStorage.setItem('banner', 'false');
    setOpen(false);
  };

  return (
    <>
      <ShowIf condition={open && appStatus !== 'production'}>
        <div className={style.alert}>
          <Typography className={style.text}>
            <SvgIcon
              classes={{root: style.fill}}
              color="error"
              component={ExclamationCircleIcon}
              viewBox="0 0 20 20"
            />
            {text}
          </Typography>
          <Typography className={style.hidden} onClick={setHiddenBanner}>
            Dismiss
          </Typography>
        </div>
      </ShowIf>
    </>
  );
};

export default BannerStatusComponent;
