import React, {useCallback} from 'react';
import {useCookies} from 'react-cookie';
import {shallowEqual, useSelector} from 'react-redux';

import {useEnqueueSnackbar} from '../Snackbar/useEnqueueSnackbar.hook';
import ShowIf from '../show-if.component';
import {AuthorizationContext} from './Authorization.context';

import {isNil} from 'lodash';
import {BannedBanner, APP_BANNER_COOKIE_KEY} from 'src/components/common/Banner';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';

export const AuthorizationProvider: React.ComponentType = ({children}) => {
  const [, setCookie] = useCookies([APP_BANNER_COOKIE_KEY]);
  const enqueueSnackbar = useEnqueueSnackbar();

  const authorized = useSelector<RootState, boolean>(
    state => isNil(state.userState.user?.deletedAt),
    shallowEqual,
  );

  const alert = useCallback(() => {
    setCookie(APP_BANNER_COOKIE_KEY, true);
    enqueueSnackbar({
      message: i18n.t('Banner.Banned'),
      variant: 'warning',
      id: 'unauthorized',
    });
  }, []);

  return (
    <>
      <AuthorizationContext.Provider value={{alert, authorized}}>
        {children}
      </AuthorizationContext.Provider>

      <ShowIf condition={!authorized}>
        <BannedBanner />
      </ShowIf>
    </>
  );
};
