import React from 'react';

import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import {ExperienceEditContainer} from 'src/components/ExperiencePreview/ExperienceEdit.container';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {initialize} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import i18n from 'src/locale';
import {getUserCurrencies} from 'src/reducers/balance/actions';
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

const EditExperience: React.FC = () => {
  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{i18n.t('Experience.Edit.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <ExperienceEditContainer />
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

  initialize({cookie: req.headers.cookie});

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;

  if (anonymous || !userId) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userId));

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchUserExperience()),
      dispatch(getUserCurrencies()),
      dispatch(fetchUserWallets()),
    ]);
  }

  await dispatch(fetchNetwork());
  await dispatch(fetchExchangeRates());

  return {
    props: {
      session,
    },
  };
});

export default EditExperience;
