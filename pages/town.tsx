import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import TownContainer from 'src/components/Town/Town.container';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {initialize} from 'src/lib/api/base';
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

const {publicRuntimeConfig, serverRuntimeConfig} = getConfig();

type TownPageProps = {
  session: Session;
};

const TownComponent: React.FC<TownPageProps> = props => {
  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{i18n.t('Myriad_Town.Title_Head', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <TopNavbarComponent
        description={i18n.t('TopNavbar.Subtitle.Myriad_Town')}
        sectionTitle={SectionTitle.MYRIAD_TOWN}
        type={'menu'}
      />
      <TownContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const {cookies} = req;

  const dispatch = store.dispatch as ThunkDispatchAction;

  const session = await getSession(context);

  if (!session?.user || session?.user?.anonymous) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const sessionInstanceURL = session?.user?.instanceURL;
  const cookiesInstanceURL = cookies['instance'];
  const defaultInstanceURL = serverRuntimeConfig.myriadAPIURL;
  const apiURL = sessionInstanceURL ?? cookiesInstanceURL ?? defaultInstanceURL;

  initialize({cookie: req.headers.cookie});

  await dispatch(fetchUser());

  await Promise.all([
    dispatch(fetchServer(apiURL)),
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

export default TownComponent;
