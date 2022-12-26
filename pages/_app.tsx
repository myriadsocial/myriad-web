import React from 'react';
import {CookiesProvider} from 'react-cookie';

import {SessionProvider} from 'next-auth/react';
import {AppProps, NextWebVitalsMetric} from 'next/app';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';

import {SnackbarProvider} from 'notistack';
import {I18nextProvider} from 'react-i18next';
import {AppContextProvider} from 'src/context/AppContextProvider';
import i18n from 'src/locale';
import {wrapper} from 'src/store';
import theme from 'src/themes/light-theme';

const MyriadInstanceProvider = dynamic(
  () => import('src/components/common/Blockchain/MyriadInstance.provider'),
  {ssr: true},
);

const {publicRuntimeConfig} = getConfig();

const App = (props: AppProps) => {
  const {Component, pageProps} = props;

  return (
    <I18nextProvider i18n={i18n}>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta property="og:site_name" content={publicRuntimeConfig.appName} />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={4}>
          <MyriadInstanceProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <SessionProvider session={pageProps.session}>
              <CookiesProvider>
                <AppContextProvider>
                  <Component {...pageProps} />
                </AppContextProvider>
              </CookiesProvider>
            </SessionProvider>
          </MyriadInstanceProvider>
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
