import * as Sentry from '@sentry/nextjs';

import React, { useEffect } from 'react';

import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { ExperienceCloneContainer } from 'src/components/ExperiencePreview/ExperienceClone.container';
import { DefaultLayout } from 'src/components/template/Default/DefaultLayout';
import { User } from 'src/interfaces/user';
import { updateSession } from 'src/lib/api/auth-link';
import { initialize } from 'src/lib/api/base';
import * as ExperienceAPI from 'src/lib/api/experience';
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

type CloneExperiencePageProps = {
  session: Session;
};

const CloneExperience: React.FC<CloneExperiencePageProps> = props => {
  const { session } = props;
  useEffect(() => {
    if (!session?.user?.instanceURL) updateSession(session);
  }, [session]);

  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>
          {i18n.t('Experience.Clone.Title', {
            appname: publicRuntimeConfig.appName,
          })}
        </title>
      </Head>
      <ExperienceCloneContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  store => async context => {
    const { query, params, req, res } = context;
    const { cookies } = req;

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
        const found = experience?.selectedUserIds?.find(
          e => e.userId === user?.id,
        );
        if (!found && experience?.createdBy !== user?.id)
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
  },
);

export default CloneExperience;
