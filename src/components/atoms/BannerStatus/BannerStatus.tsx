import {ExclamationIcon, XIcon} from '@heroicons/react/solid';

import React from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';

import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {version} from '../../../../package.json';
import useStyles from './banner.style';

import ShowIf from 'src/components/common/show-if.component';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  text?: string;
};

const BannerStatusComponent: React.FC<Props> = props => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const style = useStyles();
  const [open, setOpen] = React.useState(false);
  const {publicRuntimeConfig} = getConfig();
  const appName = publicRuntimeConfig.appName;
  const appStatus = publicRuntimeConfig.appStatus;
  const {
    text = `You are currently using ${appName} v.${version}, It’s not audited so use it on your own risk!`,
  } = props;

  React.useEffect(() => {
    const status = localStorage.getItem('banner');

    status && setOpen(!JSON.parse(status).includes(user?.id));
    !status && setOpen(true);
  }, []);

  const setHiddenBanner = () => {
    const status = localStorage.getItem('banner');
    let blockList = [];
    if (status) blockList = JSON.parse(status);

    blockList.push(user?.id);
    localStorage.setItem('banner', JSON.stringify(blockList));
    setOpen(false);
  };

  return (
    <>
      <ShowIf condition={open && appStatus !== 'production'}>
        <div className={style.root}>
          <Typography variant="body1" className={style.text}>
            <SvgIcon
              classes={{root: style.fill}}
              color="secondary"
              component={ExclamationIcon}
              viewBox="0 0 20 20"
            />
            {text}
          </Typography>
          <Typography variant="body1" className={`${style.text} ${style.icon}`}>
            <SvgIcon
              onClick={setHiddenBanner}
              classes={{root: style.fill}}
              color="inherit"
              component={XIcon}
              viewBox="0 0 20 20"
            />
          </Typography>
        </div>
      </ShowIf>
    </>
  );
};

export default BannerStatusComponent;
