import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {NavbarComponent} from 'src/components/Mobile/Navbar/Navbar';
import {RichTextContainer} from 'src/components/Richtext/RichTextContainer';
import {TimelineContainer} from 'src/components/Timeline/TimelineContainer';
import Banner from 'src/components/atoms/BannerStatus/BannerStatus';
import {SearchBoxContainer} from 'src/components/atoms/Search/SearchBoxContainer';
import {TippingSuccess} from 'src/components/common/Tipping/render/Tipping.success';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {initialize} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
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
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

const BannedDialog = dynamic(() => import('src/components/BannedDialog/BannedDialog'), {
  ssr: false,
});

const Home: React.FC = () => {
  const router = useRouter();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [dialogBanned, setDialogBanned] = useState({
    open: false,
  });

  useEffect(() => {
    if (user?.deletedAt) {
      setDialogBanned({...dialogBanned, open: true});
    }
  }, [user]);

  const performSearch = (query: string) => {
    const DELAY = 100;
    setTimeout(() => {
      // shallow push, without rerender page
      router.push(
        {
          pathname: 'search',
          query: {
            q: query,
          },
        },
        undefined,
        {shallow: true},
      );
    }, DELAY);
  };

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{i18n.t('Home.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>

      <NavbarComponent onSubmitSearch={performSearch} />

      <Banner />
      <SearchBoxContainer onSubmitSearch={performSearch} hidden={true} />
      <RichTextContainer />
      <TimelineContainer filterType="type" selectionType="order" />

      <BannedDialog
        open={dialogBanned.open}
        onClose={() => setDialogBanned({...dialogBanned, open: false})}
      />
      <TippingSuccess />
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
  console.log('SET HEADERS');
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
      dispatch(getUserCurrencies()),
      dispatch(fetchFriend()),
      dispatch(fetchUserWallets()),
    ]);
  }

  await dispatch(fetchNetwork());
  await dispatch(fetchExchangeRates());
  await dispatch(fetchUserExperience());

  return {
    props: {
      session,
    },
  };
});

export default Home;
