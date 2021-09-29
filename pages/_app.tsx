import createCache from '@emotion/cache';
import {CacheProvider} from '@emotion/react';

import React from 'react';
import {CookiesProvider} from 'react-cookie';

import {Provider as AuthProvider} from 'next-auth/client';
import {AppProps, NextWebVitalsMetric} from 'next/app';
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';

import {wrapper} from '../src/store';
import themeV2 from '../src/themes/light-theme-v2';

import {SearchProvider} from 'src/components/search/search.context';
import {AlertProvider} from 'src/context/alert.context';

function createEmotionCache() {
  return createCache({key: 'css'});
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App = (props: AppProps) => {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

  const pageTitle = 'Myriad';
  const description =
    'A social platform that’s entirely under your control. Remain anonymous, look for your own topics, choose your interface and control what you see.';

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={pageTitle} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
        <title>{pageTitle}</title>
      </Head>
      <ThemeProvider theme={themeV2}>
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
      </ThemeProvider>
    </CacheProvider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log('report:', metric);
}

export default wrapper.withRedux(App);
