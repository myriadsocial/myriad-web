import {Firegun} from '@yokowasis/firegun';

import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {RichTextContainer} from '../src/components-v2/Richtext/RichTextContainer';
import {TimelineContainer} from '../src/components-v2/Timeline/TimelineContainer';
import {SearchBoxContainer} from '../src/components-v2/atoms/Search/SearchBoxContainer';
import {ToasterContainer} from '../src/components-v2/atoms/Toaster/ToasterContainer';
import {DefaultLayout} from '../src/components-v2/template/Default/DefaultLayout';

import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {setAnonymous, setUser, fetchConnectedSocials} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';

const Home: React.FC = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConnectedSocials());
    dispatch(fetchAvailableToken());
  }, [dispatch]);

  useEffect(() => {
    // Patch pub dan Epub
    const {publicRuntimeConfig} = getConfig();
    const baseURL = publicRuntimeConfig.apiURL;
    const gunRelayURL = publicRuntimeConfig.gunRelayURL.split(',');
    const userID = props.session.user.address;

    const fg = new Firegun(gunRelayURL);

    async function userLoginSignup(gunUser: string, gunPass: string, alias: string) {
      try {
        await fg.userLogin(gunUser, gunPass, alias);
      } catch (error) {
        await fg.userNew(gunUser, gunPass, alias);
      }
    }

    async function patchUser(id: string, pubkey: string, epub: string) {
      fetch(`${baseURL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gunPub: pubkey,
          gunEpub: epub,
        }),
      }).then(res => {
        console.log('PATCH BERHASIL', res);
      });
    }

    fetch(`${baseURL}/users/${userID}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(async result => {
        console.log(result);
        const gunUser = userID;
        const gunPass = result.password.slice(0, 10);
        const gunAlias = result.name;
        if (fg.user.alias === '') {
          await userLoginSignup(gunUser, gunPass, gunAlias);
          await patchUser(userID, fg.user.pair.pub, fg.user.pair.epub);
          fg.userPut('alias', gunAlias);
        } else {
          if (fg.user.alias !== gunAlias) {
            fg.userLogout();
            await userLoginSignup(gunUser, gunPass, gunAlias);
            await patchUser(userID, fg.user.pair.pub, fg.user.pair.epub);
            fg.userPut('alias', gunAlias);
          }
        }
      });
  }, []);

  //TODO: any logic + components which replace
  // the middle column of home page should go here

  const router = useRouter();

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
      <RichTextContainer />
      <TimelineContainer />
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

export default Home;
