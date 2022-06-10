import React from 'react';
import {CookiesProvider} from 'react-cookie';

import {Provider as AuthProvider} from 'next-auth/client';
import {AppProps, NextWebVitalsMetric} from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';

import {CssBaseline, useMediaQuery, useTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import {withStyles, WithStyles} from '@material-ui/core/styles';

import i18n from '../src/locale';
import {wrapper} from '../src/store';
import themeV2 from '../src/themes/light-theme';

import {SnackbarProvider} from 'notistack';
import {I18nextProvider} from 'react-i18next';
import {ToasterSnack} from 'src/components/atoms/ToasterSnack';
import {AppContextProvider} from 'src/context/AppContextProvider';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';

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

const {publicRuntimeConfig} = getConfig();

const App = ({classes, ...props}: AppProps & WithStyles<typeof snackbarStyles>) => {
  const {Component, pageProps} = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const {
    notifications,
    displayed,
    clearToasterSnack,
    saveDisplayedToastSnack,
    removeDisplayedToastSnack,
  } = useToasterSnackHook();
  const notistackRef = React.createRef<SnackbarProvider>();

  React.useEffect(() => {
    notifications.forEach(({key, message, variant}) => {
      if (displayed.includes(key)) {
        return;
      }
      notistackRef?.current?.enqueueSnackbar('', {
        content: <ToasterSnack key={key} message={message} variant={variant} />,
        autoHideDuration: 3000,
        onExited: () => {
          clearToasterSnack({key: key});
          removeDisplayedToastSnack(key);
        },
      });
      saveDisplayedToastSnack(key);
    });
  }, [notifications, displayed]);

  return (
    <I18nextProvider i18n={i18n}>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta property="og:site_name" content={publicRuntimeConfig.appName} />
      </Head>
      <ThemeProvider theme={themeV2}>
        <SnackbarProvider
          ref={notistackRef}
          anchorOrigin={{
            vertical: isMobile ? 'bottom' : 'top',
            horizontal: 'right',
          }}
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
              <AppContextProvider>
                <Component {...pageProps} />
              </AppContextProvider>
            </CookiesProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('report:', metric);
  }
}

export default wrapper.withRedux(withStyles(snackbarStyles)(App));
