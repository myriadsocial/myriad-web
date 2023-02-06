import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import {COOKIE_INSTANCE_URL} from 'components/SelectServer';
import AlertComponent from 'src/components/atoms/Alert/Alert.component';
import ShowIf from 'src/components/common/show-if.component';
import {LoginLayout} from 'src/components/template/Login';
import {MobileLayout} from 'src/components/template/Login';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import {initialize} from 'src/lib/api/base';
import i18n from 'src/locale';
import {fetchServer} from 'src/reducers/server/actions';
import {fetchNetwork} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const Login = dynamic(() => import('src/components/Login/Login'), {
  ssr: false,
});
const OnBoardingContainer = dynamic(
  () => import('src/components/Mobile/OnBoardingView/OnBoardingView.container'),
  {
    ssr: false,
  },
);

const {publicRuntimeConfig, serverRuntimeConfig} = getConfig();

const description = i18n.t('Login.Description');

type IndexPageProps = {
  mobile: boolean;
  redirectAuth: WalletTypeEnum | null;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function LoginPage(props: IndexPageProps) {
  const {mobile, redirectAuth} = props;

  return (
    <>
      <Head>
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={publicRuntimeConfig.appName} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
        <title>{publicRuntimeConfig.appName.concat(' | Login')}</title>
      </Head>

      <ShowIf condition={!mobile}>
        <LoginLayout>
          <Login redirectAuth={redirectAuth} />
          <AlertComponent />
        </LoginLayout>
      </ShowIf>

      <ShowIf condition={mobile}>
        <MobileLayout>
          <OnBoardingContainer redirectAuth={redirectAuth} />
        </MobileLayout>
      </ShowIf>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req, res, query} = context;
  const {headers, cookies} = req;

  const dispatch = store.dispatch as ThunkDispatchAction;

  const queryInstanceURL = query.rpc;
  const cookiesInstanceURL = cookies[COOKIE_INSTANCE_URL];
  const defaultInstanceURL = serverRuntimeConfig.myriadAPIURL;
  const apiURL = queryInstanceURL ?? cookiesInstanceURL ?? defaultInstanceURL;

  res.setHeader('set-cookie', [`${COOKIE_INSTANCE_URL}=${apiURL}`]);

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

  let session: Session | null = null;

  try {
    session = await getSession(context);
  } catch {
    // ignore
  }

  const {redirect} = query;

  if (session?.user && !session?.user?.anonymous) {
    return {
      redirect: {
        destination: (redirect as string) || '/',
        permanent: false,
      },
    };
  }

  initialize({apiURL});

  await dispatch(fetchNetwork());
  await dispatch(fetchServer(apiURL));

  return {
    props: {
      mobile,
      redirectAuth,
    },
  };
});
