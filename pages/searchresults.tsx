import React from 'react';
import {useSelector} from 'react-redux';

import {getSession} from 'next-auth/client';

import {SearchResultContainer} from '../src/components-v2/Search/SearchResultContainer';
import {ToasterContainer} from '../src/components-v2/atoms/Toaster/ToasterContainer';
import {DefaultLayout} from '../src/components-v2/template/Default/DefaultLayout';
import {healthcheck} from '../src/lib/api/healthcheck';
import {RootState} from '../src/reducers';
import {fetchAvailableToken} from '../src/reducers/config/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from '../src/reducers/user/actions';
import {UserState} from '../src/reducers/user/reducer';
import {wrapper} from '../src/store';

import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {ThunkDispatchAction} from 'src/types/thunk';

const Home: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  if (!user) return null;

  return (
    <DefaultLayout isOnProfilePage={false}>
      <ToasterContainer />
      <SearchResultContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
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

  return {
    props: {
      session,
    },
  };
});
export default Home;
