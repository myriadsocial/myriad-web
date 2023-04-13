import React, { useEffect } from 'react';

import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { TopNavbarComponent } from 'src/components/atoms/TopNavbar';
import { DefaultLayout } from 'src/components/template/Default/DefaultLayout';
import { useUserHook } from 'src/hooks/use-user.hook';
import { updateSession } from 'src/lib/api/auth-link';
import { initialize } from 'src/lib/api/base';
import { healthcheck } from 'src/lib/api/healthcheck';
import i18n from 'src/locale';
import { fetchAvailableToken } from 'src/reducers/config/actions';
import { fetchExchangeRates } from 'src/reducers/exchange-rate/actions';
import { countNewNotification } from 'src/reducers/notification/actions';
import { fetchServer } from 'src/reducers/server/actions';
import {
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import { wrapper } from 'src/store';
import { ThunkDispatchAction } from 'src/types/thunk';

const { publicRuntimeConfig } = getConfig();

const MyWalletContainerWithoutSSR = dynamic(
  () => import('../src/components/MyWallet/MyWalletContainer'),
  {
    ssr: false,
  },
);

type WalletPageProps = {
  session: Session;
};

const Wallet: React.FC<WalletPageProps> = props => {
  const { session } = props;
  useEffect(() => {
    if (!session?.user?.instanceURL) updateSession(session);
  }, [session]);

  const { user } = useUserHook();

  if (!user) return null;

  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>
          {i18n.t('Wallet.Title', { appname: publicRuntimeConfig.appName })}
        </title>
      </Head>
      <TopNavbarComponent
        sectionTitle={i18n.t('TopNavbar.Title.Wallet')}
        description={i18n.t('TopNavbar.Subtitle.Wallet')}
        type={'menu'}
      />
      <MyWalletContainerWithoutSSR />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  store => async context => {
    const { query, req, res } = context;
    const { cookies } = req;

    const dispatch = store.dispatch as ThunkDispatchAction;

    let session: Session | null = null;

    try {
      session = await getSession(context);
    } catch {
      // ignore
    }

    if (!session?.user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const queryInstanceURL = query.instance;
    const sessionInstanceURL = session?.user?.instanceURL;
    const cookiesInstanceURL = cookies[COOKIE_INSTANCE_URL];
    const defaultInstanceURL = publicRuntimeConfig.myriadAPIURL;

    const anonymous = !session?.user;
    const apiURL =
      sessionInstanceURL ??
      queryInstanceURL ??
      cookiesInstanceURL ??
      defaultInstanceURL;

    const available = await healthcheck(apiURL);

    if (!available) {
      return {
        redirect: {
          destination: '/maintenance',
          permanent: false,
        },
      };
    }

    initialize({ cookie: req.headers.cookie }, anonymous);

    res.setHeader('set-cookie', [`${COOKIE_INSTANCE_URL}=${apiURL}`]);

    await dispatch(fetchUser());
    await Promise.all([
      dispatch(fetchServer(sessionInstanceURL)),
      dispatch(fetchNetwork()),
      dispatch(fetchAvailableToken()),
      dispatch(fetchExchangeRates()),
      dispatch(fetchUserExperience()),
      dispatch(fetchUserWallets()),
      dispatch(fetchConnectedSocials()),
      dispatch(countNewNotification()),
    ]);

    return {
      props: {
        session,
      },
    };
  },
);

export default Wallet;
