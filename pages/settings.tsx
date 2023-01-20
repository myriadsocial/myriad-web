import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {SettingsContainer, SettingsType, useSettingList} from 'src/components/Settings';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {initialize} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import {getServer} from 'src/lib/api/server';
import i18n from 'src/locale';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {
  setAnonymous,
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

type SettingPageProps = {
  session: Session;
  logo: string;
};

const Settings: React.FC<SettingPageProps> = props => {
  const {query} = useRouter();

  const settings = useSettingList();

  const currentSection = query.section as SettingsType | undefined;
  const selected = settings.find(item => item.id === currentSection);

  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{i18n.t('Setting.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <TopNavbarComponent
        description={selected ? `${selected.title}` : i18n.t('Setting.Default_Title')}
        sectionTitle={i18n.t('Section.Settings')}
        type={selected ? 'back' : 'menu'}
      />
      <SettingsContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;

  const dispatch = store.dispatch as ThunkDispatchAction;

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

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const anonymous = !session || Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;
  const token = session?.user.token;

  initialize({cookie: req.headers.cookie}, anonymous);

  if (anonymous || (!userId && !token)) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser());

    await Promise.all([
      dispatch(fetchUserWallets()),
      dispatch(fetchConnectedSocials()),
      dispatch(countNewNotification()),
    ]);
  }

  await Promise.all([
    dispatch(fetchNetwork()),
    dispatch(fetchAvailableToken()),
    dispatch(fetchExchangeRates()),
    dispatch(fetchUserExperience()),
  ]);

  const data = await getServer();

  return {
    props: {
      session,
      logo: data.images.logo_banner,
    },
  };
});

export default Settings;
