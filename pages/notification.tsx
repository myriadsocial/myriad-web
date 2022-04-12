import React from 'react';
import {useSelector} from 'react-redux';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';

import {NotificationsContainer} from 'src/components/Notifications';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {setHeaders} from 'src/lib/api/base';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {NotificationState} from 'src/reducers/notification/reducer';
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

const Notification: React.FC = () => {
  const {total} = useSelector<RootState, NotificationState>(state => state.notificationState);

  //TODO: any logic + components which replace
  // the middle column of home page should go here

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{i18n.t('Notification.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <TopNavbarComponent
        description={`${total} new notifications`}
        sectionTitle={SectionTitle.NOTIFICATION}
      />
      <NotificationsContainer gutter={2} infinite />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;

  const dispatch = store.dispatch as ThunkDispatchAction;
  const session = await getSession(context);

  setHeaders({cookie: req.headers.cookie as string});

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
      dispatch(fetchUserWallets()),
    ]);
  }

  await dispatch(fetchNetwork());

  return {
    props: {
      session,
    },
  };
});

export default Notification;
