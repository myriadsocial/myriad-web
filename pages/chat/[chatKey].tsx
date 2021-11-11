import Chat from '@yokowasis/firechat';
import {Firegun, Chat as ChatFG, common} from '@yokowasis/firegun';

import React from 'react';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {SearchBoxContainer} from '../../src/components-v2/atoms/Search/SearchBoxContainer';
import {ToasterContainer} from '../../src/components-v2/atoms/Toaster/ToasterContainer';
import {DefaultLayout} from '../../src/components-v2/template/Default/DefaultLayout';

import Banner from 'src/components-v2/atoms/BannerStatus/BannerStatus';
import {healthcheck} from 'src/lib/api/healthcheck';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const Home: React.FC = (props: any) => {
  const router = useRouter();
  const {chatKey} = router.query;

  // React Component as a state
  const [chatComp, setChatComp] = React.useState<
    {common: typeof common; fg: Firegun; chat: ChatFG}[]
  >([]);

  React.useEffect(() => {
    // Chat Component harus dirender menggunakan useEffect,
    // karena selain di useeffect belum ada akses ke localstorage

    const {publicRuntimeConfig} = getConfig();
    const gunRelayURL = publicRuntimeConfig.gunRelayURL.split(',');
    const fg = new Firegun(gunRelayURL);

    const chat = new ChatFG(fg);

    const arr = [];
    arr.push({
      fg: fg,
      chat: chat,
      common: common,
    });

    setChatComp(arr);
  }, []);

  const performSearch = (query: string) => {
    localStorage.setItem('searchQuery', query ?? '');

    const DELAY = 2000;
    setTimeout(() => {
      // shallow push, without rerender page
      router.push('/searchresults', `/searchresults?${query}`, {shallow: true});
    }, DELAY);
  };

  return (
    <DefaultLayout isOnProfilePage={false}>
      <ToasterContainer />
      <Banner />
      <SearchBoxContainer onSubmitSearch={performSearch} />
      {chatComp.map((value, index) => (
        <Chat
          common={value.common}
          key={index}
          fg={value.fg}
          chat={value.chat}
          newChat={chatKey as string}
        />
      ))}
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
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
