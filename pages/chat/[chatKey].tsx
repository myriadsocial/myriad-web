import Chat from '@yokowasis/firechat';
import {Firegun, Chat as ChatFG, common} from '@yokowasis/firegun';

import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {SearchBoxContainer} from '../../src/components-v2/atoms/Search/SearchBoxContainer';
import {ToasterContainer} from '../../src/components-v2/atoms/Toaster/ToasterContainer';
import {DefaultLayout} from '../../src/components-v2/template/Default/DefaultLayout';

import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {setAnonymous, setUser, fetchConnectedSocials} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();

  const [chatComp, setChatComp] = useState<{common:typeof common, fg: Firegun; chat: ChatFG}[]>([]);

  useEffect(() => {
    dispatch(fetchConnectedSocials());
    dispatch(fetchAvailableToken());
  }, [dispatch]);

  useEffect(() => {
    const {publicRuntimeConfig} = getConfig();
    const gunRelayURL = publicRuntimeConfig.gunRelayURL.split(',');
    const fg = new Firegun(gunRelayURL);

    const chat = new ChatFG(fg);

    const arr = [];
    arr.push({
      fg: fg,
      chat: chat,
      common : common,
    });

    setChatComp(arr);
  }, []);

  //TODO: any logic + components which replace
  // the middle column of home page should go here

  const router = useRouter();
  const {chatKey} = router.query;

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
      <SearchBoxContainer onSubmitSearch={performSearch} />
      {chatComp.map((value, index) => (
        <Chat common={value.common} key={index} fg={value.fg} chat={value.chat} newChat={chatKey as string} />
      ))}
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {dispatch} = store;
  const {res} = context;

  const available = await healthcheck();

  if (!available) {
    res.setHeader('location', '/maintenance');
    res.statusCode = 302;
    res.end();
  }

  const session = await getSession(context);

  if (!session) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;
  const username = session?.user.name as string;

  //TODO: this process should call thunk action creator instead of dispatch thunk acion
  //ISSUE: state not hydrated when using thunk action creator
  if (anonymous) {
    dispatch(setAnonymous(username));
  } else {
    const user = await UserAPI.getUserDetail(userId);

    dispatch(setUser(user));
  }

  return {
    props: {
      session,
    },
  };
});

export default ChatPage;
