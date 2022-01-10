import React, {useEffect} from 'react';

import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {useRouter} from 'next/router';

import AlertComponent from 'src/components/atoms/Alert/Alert.component';
import {LoginLayout} from 'src/components/template/Login';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {healthcheck} from 'src/lib/api/healthcheck';

const Login = dynamic(() => import('src/components/Login/Login'), {
  ssr: false,
});

const {publicRuntimeConfig} = getConfig();

const description =
  'A social platform that’s entirely under your control. Remain anonymous, look for your own topics, choose your interface and control what you see.';

export default function Index() {
  const {query} = useRouter();

  const {showAlert} = useAlertHook();

  useEffect(() => {
    if (query.error) {
      showAlert({
        message: 'Something wrong when try to loggedin.',
        severity: 'error',
        title: 'Login failed',
      });
    }
  }, [query.error]);

  return (
    <>
      <Head>
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={publicRuntimeConfig.appName} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
        <title>{publicRuntimeConfig.appName}</title>
      </Head>

      <LoginLayout>
        <Login />
        <AlertComponent />
      </LoginLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {req} = context;
  const {headers} = req;

  if (typeof window === 'undefined' && headers['user-agent']) {
    const DeviceDetect = eval('require("node-device-detector")');

    const device = new DeviceDetect();
    const {
      device: {type},
    } = device.detect(headers['user-agent']);

    if (type === 'smartphone') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers,
        },
      };
    }
  }

  const available = await healthcheck();

  if (!available) {
    return {
      redirect: {
        destination: '/maintenance',
        permanent: false,
      },
    };
  }

  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
