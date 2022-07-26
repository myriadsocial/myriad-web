import * as Sentry from '@sentry/nextjs';

import React from 'react';

import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {ExperiencePreviewContainer} from 'src/components/ExperiencePreview/ExperiencePreview.container';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {generateAnonymousUser} from 'src/helpers/auth';
import {initialize} from 'src/lib/api/base';
import * as ExperienceAPI from 'src/lib/api/experience';
import {healthcheck} from 'src/lib/api/healthcheck';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {fetchFriend} from 'src/reducers/friend/actions';
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

type ExperiencePageProps = {
  title: string;
  description: string | null;
  image: string | null;
};

const PreviewExperience: React.FC<ExperiencePageProps> = props => {
  const {title, image, description} = props;

  const router = useRouter();

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={publicRuntimeConfig.appAuthURL + router.asPath} />
        <meta property="og:description" content={description ?? ''} />
        <meta property="og:title" content={title} />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:image:width" content="2024" />
        <meta property="og:image:height" content="1012" />
        <meta property="og:image:secure_url" content={image} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description ?? ''} />
        <meta name="twitter:image" content={image ?? ''} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ExperiencePreviewContainer />
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

  const anonymous = Boolean(session?.user.anonymous);
  const userAddress = session?.user.address as string;

  initialize({cookie: req.headers.cookie}, anonymous);

  if (anonymous || !userAddress) {
    const username = generateAnonymousUser();

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userAddress));

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(countNewNotification()),
      dispatch(getUserCurrencies()),
      dispatch(fetchUserWallets()),
      dispatch(fetchFriend()),
    ]);
  }

  await Promise.all([
    dispatch(fetchAvailableToken()),
    dispatch(fetchNetwork()),
    dispatch(fetchExchangeRates()),
  ]);

  await dispatch(fetchUserExperience());

  try {
    const experience = await ExperienceAPI.getExperienceDetail(experienceId);

    console.log('experience', experience);

    return {
      props: {
        title: experience.name,
        description: experience.description,
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

export default PreviewExperience;
