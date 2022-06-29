import {ExclamationIcon, XIcon} from '@heroicons/react/solid';

import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';

import getConfig from 'next/config';

import Grid from '@material-ui/core/Grid';
import SvgIcon from '@material-ui/core/SvgIcon';

import useStyles from './Banner.style';

import clsx from 'clsx';
import {Text} from 'components/atoms/Text';

const {publicRuntimeConfig} = getConfig();
export const APP_BANNER_COOKIE_KEY = 'hide-banner';

export const AppStatusBanner: React.FC = () => {
  const style = useStyles();
  const [cookies, setCookie] = useCookies([APP_BANNER_COOKIE_KEY]);

  const [hidden, setHidden] = useState(false);
  const appEnvironment = publicRuntimeConfig.appEnvironment;
  const appName = publicRuntimeConfig.appName;
  const version = publicRuntimeConfig.appVersion;

  useEffect(() => {
    setHidden(Boolean(cookies[APP_BANNER_COOKIE_KEY]));
  }, [cookies]);

  const hideBanner = () => {
    setCookie(APP_BANNER_COOKIE_KEY, true);

    setHidden(true);
  };

  if (appEnvironment === 'mainnet' || hidden) return null;

  return (
    <Grid
      container
      direction="row"
      wrap="nowrap"
      justifyContent="center"
      alignItems="center"
      className={clsx({
        [style.root]: true,
        [style.padding]: true,
      })}>
      <SvgIcon
        classes={{root: style.icon}}
        color="secondary"
        component={ExclamationIcon}
        viewBox="0 0 20 20"
      />

      <Text
        locale="Banner.Demo"
        variant="body1"
        weight="semi-bold"
        values={{
          appName,
          version,
        }}
      />

      <SvgIcon
        onClick={hideBanner}
        classes={{
          root: clsx({
            [style.icon]: true,
            [style.right]: true,
          }),
        }}
        component={XIcon}
        viewBox="0 0 20 20"
      />
    </Grid>
  );
};
