import createCache from '@emotion/cache';
import {CacheProvider, EmotionCache} from '@emotion/react';
import {XIcon} from '@heroicons/react/outline';

import React from 'react';
import {CookiesProvider} from 'react-cookie';

import {Provider as AuthProvider} from 'next-auth/client';
import {AppProps, NextWebVitalsMetric} from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import {ThemeProvider} from '@material-ui/core/styles';
import {withStyles, WithStyles} from '@material-ui/core/styles';

import {wrapper} from '../src/store';
import themeV2 from '../src/themes/light-theme-v2';

import {SnackbarProvider} from 'notistack';
import {SearchProvider} from 'src/components/search/search.context';
import {AlertProvider} from 'src/context/alert.context';

const snackbarStyles = {
  root: {
    backgroundColor: '#FFF',
  },
  containerRoot: {
    borderRadius: 30,
  },
  success: {
    backgroundColor: '#39BF87',
  },
  error: {
    backgroundColor: '#FE3333',
  },
  warning: {
    backgroundColor: '#FFD24D',
  },
  info: {
    backgroundColor: '#1070CA',
  },
};

function createEmotionCache() {
  // TODO remove prepend: true once JSS is out
  return createCache({key: 'css', prepend: true});
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
const {publicRuntimeConfig} = getConfig();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = ({classes, ...props}: MyAppProps & WithStyles<typeof snackbarStyles>) => {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (
    event: React.MouseEvent | React.SyntheticEvent,
    key: string | number,
  ): void => {
    if (notistackRef.current) {
      notistackRef.current.closeSnackbar(key);
    }
  };

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta property="og:site_name" content={publicRuntimeConfig.appName} />
      </Head>
      <ThemeProvider theme={themeV2}>
        <SnackbarProvider
          ref={notistackRef}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          classes={{
            variantSuccess: classes.success,
            variantError: classes.error,
            variantWarning: classes.warning,
            variantInfo: classes.info,
            root: classes.root,
            containerRoot: classes.containerRoot,
          }}
          action={key => (
            <>
              <IconButton aria-label="close" onClick={e => onClickDismiss(e, key)}>
                <SvgIcon component={XIcon} viewBox="0 0 24 24" />
              </IconButton>
            </>
          )}
          maxSnack={5}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AuthProvider
            // Provider options are not required but can be useful in situations where
            // you have a short session maxAge time. Shown here with default values.
            options={{
              // Client Max Age controls how often the useSession in the client should
              // contact the server to sync the session state. Value in seconds.
              // e.g.
              // * 0  - Disabled (always use cache value)
              // * 60 - Sync session state with server if it's older than 60 seconds
              clientMaxAge: 0,
              // Keep Alive tells windows / tabs that are signed in to keep sending
              // a keep alive request (which extends the current session expiry) to
              // prevent sessions in open windows from expiring. Value in seconds.
              //
              // Note: If a session has expired when keep alive is triggered, all open
              // windows / tabs will be updated to reflect the user is signed out.
              keepAlive: 0,
            }}
            session={pageProps.session}>
            <CookiesProvider>
              <AlertProvider>
                <SearchProvider>
                  <Component {...pageProps} />
                </SearchProvider>
              </AlertProvider>
            </CookiesProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log('report:', metric);
}

export default wrapper.withRedux(withStyles(snackbarStyles)(App));
