import React from 'react';
import {useSelector} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {ProfileTimeline} from 'src/components-v2/Profile/ProfileComponent';
import {ToasterContainer} from 'src/components-v2/atoms/Toaster/ToasterContainer';
import {DefaultLayout} from 'src/components-v2/template/Default/DefaultLayout';
import {loginAsAnonymous} from 'src/helpers/auth';
import {User} from 'src/interfaces/user';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {setError} from 'src/reducers/base/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {checkFriendedStatus, setProfile} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

type ProfilePageProps = {
  session: Session;
  title: string;
  description: string;
  image: string | null;
};

const ProfilePageComponent: React.FC<ProfilePageProps> = props => {
  const {title, description, image} = props;
  const {publicRuntimeConfig} = getConfig();
  const router = useRouter();

  const {detail: profileDetail} = useSelector<RootState, ProfileState>(state => state.profileState);

  return (
    <DefaultLayout isOnProfilePage={true}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta name="og:url" content={publicRuntimeConfig.nextAuthURL + router.asPath} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        {image && <meta name="og:image" content={image} />}
        <meta name="og:type" content="website" />
        <meta name="fb:app_id" content={publicRuntimeConfig.facebookAppId} />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        <meta name="twitter:card" content="summary" />
      </Head>

      <ProfileTimeline profile={profileDetail} loading={false} />
      <ToasterContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {params} = context;
  const dispatch = store.dispatch as ThunkDispatchAction;

  if (typeof window === 'undefined') {
    const DeviceDetect = eval('require("node-device-detector")');

    const device = new DeviceDetect();
    const {
      device: {type},
    } = device.detect(context.req.headers['user-agent']);

    if (type === 'smartphone') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers: context.req.headers,
        },
      };
    }
  }

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
    loginAsAnonymous();
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;
  const profileId = params?.id as string;

  if (anonymous || !userId) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userId));

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchExperience()),
    ]);
  }

  let detail: User | null = null;

  if (profileId) {
    try {
      detail = await UserAPI.getUserDetail(profileId);

      if (detail) {
        dispatch(setProfile(detail));

        await dispatch(checkFriendedStatus());
      }
    } catch (error) {
      setError({
        message: 'user not found',
      });
    }
  }

  return {
    props: {
      session,
      title: detail?.name ?? null,
      description: detail?.bio ?? null,
      image: detail?.profilePictureURL ?? null,
    },
  };
});

export default ProfilePageComponent;
