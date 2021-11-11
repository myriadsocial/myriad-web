import {Firegun} from '@yokowasis/firegun';

import React from 'react';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {RichTextContainer} from '../src/components-v2/Richtext/RichTextContainer';
import {TimelineContainer} from '../src/components-v2/Timeline/TimelineContainer';
import {SearchBoxContainer} from '../src/components-v2/atoms/Search/SearchBoxContainer';
import {ToasterContainer} from '../src/components-v2/atoms/Toaster/ToasterContainer';
import {DefaultLayout} from '../src/components-v2/template/Default/DefaultLayout';

import Banner from 'src/components-v2/atoms/BannerStatus/BannerStatus';
import {healthcheck} from 'src/lib/api/healthcheck';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const Home: React.FC = (props: any) => {
  React.useEffect(() => {
    // Patch pub dan Epub
    const {publicRuntimeConfig} = getConfig();
    const baseURL = publicRuntimeConfig.apiURL;
    const gunRelayURL = publicRuntimeConfig.gunRelayURL.split(',');
    const userID = props.session.user.address;

    const fg = new Firegun(gunRelayURL);

    (window as any).fg = fg;

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

    // Fetch dari API apakah user sudah ada di Server API
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
        console.log(
          'Login',
          'user : ',
          gunUser,
          'password : ',
          gunPass,
          'passwordLengkap : ',
          result.password,
          'alias : ',
          gunAlias,
        );
        if (fg.user.alias === '') {
          // User Belum Ada di server API
          await userLoginSignup(gunUser, gunPass, gunAlias);
          await patchUser(userID, fg.user.pair.pub, fg.user.pair.epub);
          fg.userPut('alias', gunAlias);
        } else {
          // User ada, tapi yang login bukan user yang di server API
          if (fg.user.alias !== gunAlias) {
            fg.userLogout();
            await userLoginSignup(gunUser, gunPass, gunAlias);
            await patchUser(userID, fg.user.pair.pub, fg.user.pair.epub);
            fg.userPut('alias', gunAlias);
          }
        }
      });
  }, []);

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
      <Banner />
      <SearchBoxContainer onSubmitSearch={performSearch} />
      <RichTextContainer />
      <TimelineContainer />
      <ToasterContainer />
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
