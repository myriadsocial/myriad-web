import {useEffect} from 'react';

import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {useRouter} from 'next/router';

import AlertComponent from 'src/components/atoms/Alert/Alert.component';
import ShowIf from 'src/components/common/show-if.component';
import {LoginLayout} from 'src/components/template/Login';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {initialize} from 'src/lib/api/base';
import i18n from 'src/locale';
import {wrapper} from 'src/store';

const LoginMagicLink = dynamic(() => import('src/components/LoginMagicLink'), {
  ssr: false,
});

const {publicRuntimeConfig} = getConfig();
const description = i18n.t('Login.Description');

type LoginMagicLinkProps = {
  mobile: boolean;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function LoginPage(props: LoginMagicLinkProps) {
  const {mobile} = props;

  const {showAlert} = useAlertHook();
  const {query} = useRouter();

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
          <LoginMagicLink />
          <AlertComponent />
        </LoginLayout>
      </ShowIf>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const {headers} = req;

  let mobile = false;

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
        destination: '/',
        permanent: false,
      },
    };
  }

  initialize();

  return {
    props: {
      mobile,
    },
  };
});
