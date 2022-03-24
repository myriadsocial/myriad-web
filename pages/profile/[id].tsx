import * as Sentry from '@sentry/nextjs';

import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {ProfileTimeline} from 'src/components/Profile/Profile';
import {SectionTitle, TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {ResourceDeleted} from 'src/components/common/ResourceDeleted';
import ShowIf from 'src/components/common/show-if.component';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {generateAnonymousUser} from 'src/helpers/auth';
import {setHeaders} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchAccountPrivacySetting} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {fetchFriend} from 'src/reducers/friend/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {checkFriendedStatus, setProfile} from 'src/reducers/profile/actions';
import {
  setAnonymous,
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

type ProfilePageProps = {
  session: Session;
  title: string;
  description: string;
  image: string | null;
  isBanned: boolean;
};

const {publicRuntimeConfig} = getConfig();

const ProfilePageComponent: React.FC<ProfilePageProps> = props => {
  const {title, description, image, isBanned} = props;

  const router = useRouter();

  return (
    <DefaultLayout isOnProfilePage={true}>
      <Head>
        <title>{isBanned ? 'Profile Not Found' : title}</title>
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={publicRuntimeConfig.appAuthURL + router.asPath} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {image && <meta property="og:image" content={image} />}
        <meta property="fb:app_id" content={publicRuntimeConfig.facebookAppId} />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        <meta name="twitter:card" content="summary" />
      </Head>

      <ProfileTimeline loading={false} isBanned={isBanned} />

      <ShowIf condition={isBanned}>
        <TopNavbarComponent description={'Profile Detail'} sectionTitle={SectionTitle.PROFILE} />
        <ResourceDeleted />
      </ShowIf>
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {params, req} = context;

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

  setHeaders({cookie: req.headers.cookie as string});

  const anonymous = session?.user.anonymous || !session ? true : false;
  const userId = session?.user.address as string;
  const profileId = params?.id as string;

  if (anonymous || !userId) {
    const username = generateAnonymousUser();

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userId));

    await Promise.all([
      dispatch(fetchConnectedSocials(userId === profileId)),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchAccountPrivacySetting(profileId)),
      dispatch(getUserCurrencies()),
      dispatch(fetchFriend()),
    ]);
  }

  await dispatch(fetchExchangeRates());
  await dispatch(fetchUserExperience());

  try {
    const detail = await UserAPI.getUserDetail(profileId, userId);

    await dispatch(setProfile(detail));

    if (!anonymous && userId) {
      await dispatch(checkFriendedStatus());
    }
    return {
      props: {
        session,
        title: detail?.name ?? null,
        description: detail?.bio ?? null,
        image: detail?.profilePictureURL ?? null,
        isBanned: Boolean(detail?.deletedAt),
      },
    };
  } catch (error) {
    Sentry.captureException(error);

    return {
      notFound: true,
    };
  }
});

export default ProfilePageComponent;
