import * as Sentry from '@sentry/nextjs';

import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import {ExperienceCloneContainer} from 'src/components/ExperiencePreview/ExperienceClone.container';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {User} from 'src/interfaces/user';
import {initialize} from 'src/lib/api/base';
import * as ExperienceAPI from 'src/lib/api/experience';
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

type CloneExperiencePageProps = {
  session: Session;
  logo: string;
};

const CloneExperience: React.FC<CloneExperiencePageProps> = props => {
  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{i18n.t('Experience.Clone.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <ExperienceCloneContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {params, req} = context;
  const experienceId = params?.experienceId as string;

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

  initialize({cookie: req.headers.cookie}, anonymous);

  if (anonymous) {
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

  try {
    const experience = await ExperienceAPI.getExperienceDetail(experienceId);
    const data = await getServer();

    if (experience?.visibility === 'selected_user') {
      if (anonymous)
        return {
          notFound: true,
        };

      const user = (await dispatch(fetchUser())) as unknown as User;
      if (!experience?.selectedUserIds?.includes(user?.id) && experience?.createdBy !== user?.id)
        return {
          notFound: true,
        };
    }

    if (experience?.visibility === 'private') {
      const user = (await dispatch(fetchUser())) as unknown as User;
      if (experience?.createdBy !== user?.id)
        return {
          notFound: true,
        };
    }

    return {
      props: {
        title: experience.name,
        description: experience?.description ?? '',
        image: experience.experienceImageURL,
        logo: data.images.logo_banner,
      },
    };
  } catch (error) {
    Sentry.captureException(error);

    return {
      notFound: true,
    };
  }
});

export default CloneExperience;
