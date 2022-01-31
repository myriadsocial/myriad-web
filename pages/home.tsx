import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {getSession, useSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {RichTextContainer} from '../src/components/Richtext/RichTextContainer';
import {TimelineContainer} from '../src/components/Timeline/TimelineContainer';
import {SearchBoxContainer} from '../src/components/atoms/Search/SearchBoxContainer';
import {DefaultLayout} from '../src/components/template/Default/DefaultLayout';
import {PromptComponent} from '../src/components/atoms/Prompt/prompt.component';

import Banner from 'src/components/atoms/BannerStatus/BannerStatus';
import {useAuthHook} from 'src/hooks/auth.hook';
import {setHeaders} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {fetchFriend} from 'src/reducers/friend/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {clearUser} from 'src/reducers/user/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [session] = useSession();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {logout} = useAuthHook();
  const [dialogBanned, setDialogBanned] = React.useState({
    open: false
  })

  const performSearch = (query: string) => {
    const DELAY = 300;
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


  React.useEffect(() => {
    if(user?.deletedAt){
      setDialogBanned({...dialogBanned, open: true});
    }
  }, [user])

  const handleSignOut = async () => {
    if (session) {
      logout();
    } else {
      dispatch(clearUser());
      await router.push(`/`);
    }
  };

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{publicRuntimeConfig.appName} - Home</title>
      </Head>

      <Banner />
      <SearchBoxContainer onSubmitSearch={performSearch} />
      <RichTextContainer />
      <TimelineContainer />
      <PromptComponent
        title={'You have been banned'}
        subtitle={'This account has been banned due to break our community rule. \n Please contact us if you think this was a mistake'}
        open={dialogBanned.open}
        icon="warning"
        onCancel={() => {
          setDialogBanned({...dialogBanned, open: false});
          handleSignOut();
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              setDialogBanned({...dialogBanned, open: false});
              handleSignOut();
              window.open(`mailto:${publicRuntimeConfig.myriadSupportMail}?subject=Complain user banned!`, '_blank');
            }}>
            OK
          </Button>
        </div>
      </PromptComponent>
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const {headers} = req;

  const dispatch = store.dispatch as ThunkDispatchAction;

  if (typeof window === 'undefined' && headers['user-agent']) {
    const UAParser = eval('require("ua-parser-js")');
    const parser = new UAParser();
    const device = parser.setUA(headers['user-agent']).getDevice();

    if (device.type === 'mobile') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers,
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
      dispatch(fetchExperience()),
      dispatch(getUserCurrencies()),
      dispatch(fetchFriend()),
    ]);
  }

  await dispatch(fetchExchangeRates());

  return {
    props: {
      session,
    },
  };
});

export default Home;
