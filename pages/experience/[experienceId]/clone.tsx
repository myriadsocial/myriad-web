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

type CloneExperiencePageProps = {
  session: Session;
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

  try {
    const experience = await ExperienceAPI.getExperienceDetail(experienceId);

    if (experience?.visibility === 'selected_user') {
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
