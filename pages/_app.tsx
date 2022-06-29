import React from 'react';
import {CookiesProvider} from 'react-cookie';

import {SessionProvider} from 'next-auth/react';
import {AppProps, NextWebVitalsMetric} from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';

import {CssBaseline, useMediaQuery, useTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';

import i18n from '../src/locale';
import {wrapper} from '../src/store';
import themeV2 from '../src/themes/light-theme';

import {SnackbarProvider} from 'notistack';
import {I18nextProvider} from 'react-i18next';
import {AppContextProvider} from 'src/context/AppContextProvider';

const {publicRuntimeConfig} = getConfig();

const App = (props: AppProps) => {
  const {Component, pageProps} = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <I18nextProvider i18n={i18n}>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta property="og:site_name" content={publicRuntimeConfig.appName} />
      </Head>
      <ThemeProvider theme={themeV2}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: isMobile ? 'bottom' : 'top',
            horizontal: 'right',
          }}
          maxSnack={4}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <SessionProvider session={pageProps.session}>
            <CookiesProvider>
              <AppContextProvider>
                <Component {...pageProps} />
              </AppContextProvider>
            </CookiesProvider>
          </SessionProvider>
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

export default wrapper.withRedux(App);
