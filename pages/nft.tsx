import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import NFTContainer from 'src/components/NFT/NFT.container';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {initialize} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import i18n from 'src/locale';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {fetchServer} from 'src/reducers/server/actions';
import {
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

type NFTPageProps = {
  session: Session;
};

const NFTComponent: React.FC<NFTPageProps> = props => {
  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{publicRuntimeConfig.appName} - NFT</title>
      </Head>
      <TopNavbarComponent
        description={i18n.t('TopNavbar.Subtitle.NFT')}
        sectionTitle={SectionTitle.NFT}
        type={'menu'}
      />
      <NFTContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;

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
        destination: '/',
        permanent: false,
      },
    };
  }

  const sessionInstanceURL = session?.user?.instanceURL;

  const available = await healthcheck(sessionInstanceURL);

  if (!available) {
    return {
      redirect: {
        destination: '/maintenance',
        permanent: false,
      },
    };
  }

  initialize({cookie: req.headers.cookie});

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
});

export default NFTComponent;
