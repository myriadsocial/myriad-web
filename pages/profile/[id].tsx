import React from 'react';
import {useSelector} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/client';

import {DefaultLayout} from '../../src/components-v2/template/Default/DefaultLayout';
import {wrapper} from '../../src/store';

import {ProfileTimeline} from 'src/components-v2/Profile/ProfileComponent';
import {ToasterContainer} from 'src/components-v2/atoms/Toaster/ToasterContainer';
import {healthcheck} from 'src/lib/api/healthcheck';
import {RootState} from 'src/reducers';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {fetchProfileDetail, checkFriendedStatus} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {ThunkDispatchAction} from 'src/types/thunk';

type ProfilePageProps = {
  session: Session;
};

const ProfilePageComponent: React.FC<ProfilePageProps> = () => {
  const {detail: profileDetail} = useSelector<RootState, ProfileState>(state => state.profileState);

  return (
    <DefaultLayout isOnProfilePage={true}>
      <ToasterContainer />

      {profileDetail && <ProfileTimeline profile={profileDetail} loading={false} />}
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
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
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

  if (profileId) {
    await dispatch(fetchProfileDetail(profileId));
    await dispatch(checkFriendedStatus());
  }

  return {
    props: {
      session,
    },
  };
});

export default ProfilePageComponent;
