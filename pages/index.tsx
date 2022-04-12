import React, {useEffect} from 'react';

import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {useRouter} from 'next/router';

import AlertComponent from 'src/components/atoms/Alert/Alert.component';
import ShowIf from 'src/components/common/show-if.component';
import {LoginLayout} from 'src/components/template/Login';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';
import i18n from 'src/locale';

const Login = dynamic(() => import('src/components/Login/Login'), {
  ssr: false,
});
const OnBoardingContainer = dynamic(
  () => import('src/components/Mobile/OnBoardingView/OnBoardingView.container'),
  {
    ssr: false,
  },
);

const {publicRuntimeConfig} = getConfig();

const description = i18n.t('Login.Description');

type IndexPageProps = {
  mobile: boolean;
  redirectAuth: WalletTypeEnum | null;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Index(props: IndexPageProps) {
  const {mobile, redirectAuth} = props;

  const {query} = useRouter();

  const {showAlert} = useAlertHook();

  useEffect(() => {
    if (query.error) {
      showAlert({
        message: i18n.t('Login.Alert.Message'),
        severity: 'error',
        title: i18n.t('Login.Alert.Title'),
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

      <ShowIf condition={!mobile}>
        <LoginLayout>
          <Login redirectAuth={redirectAuth} />
          <AlertComponent />
        </LoginLayout>
      </ShowIf>

      <ShowIf condition={mobile}>
        <OnBoardingContainer />
      </ShowIf>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {req, query} = context;
  const {headers} = req;

  let mobile = false;
  let redirectAuth: string | null = null;

  if (query.auth) {
    redirectAuth = Array.isArray(query.auth) ? query.auth[0] : query.auth;
  }

  if (typeof window === 'undefined' && headers['user-agent']) {
    const UAParser = eval('require("ua-parser-js")');
    const parser = new UAParser();
    const device = parser.setUA(headers['user-agent']).getDevice();

    if (device.type === 'mobile') {
      mobile = true;
    }
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
    props: {
      mobile,
      redirectAuth,
    },
  };
};
