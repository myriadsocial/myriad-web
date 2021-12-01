// SEARCH PAGE
import React from 'react';
import {useSelector} from 'react-redux';

import {getSession} from 'next-auth/client';

import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Layout from 'src/components/Layout/Layout.container';
import SearchTimeline from 'src/components/search/search-timeline.component';
import TopicComponent from 'src/components/topic/topic.component';
import UserDetail from 'src/components/user/user.component';
import {Wallet} from 'src/components/wallet/wallet.component';
import {healthcheck} from 'src/lib/api/healthcheck';
import {RootState} from 'src/reducers';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    user: {
      flex: '0 0 327px',
      width: 327,
      marginRight: 0,
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important',
    },
    wallet: {
      width: 327,
    },
    fullwidth: {
      width: 327,
    },
    fullheight: {
      height: '100vh',
    },
    profile: {
      flexGrow: 1,
    },
    content: {
      padding: '0 24px 0 24px',
      marginRight: 'auto',
      marginLeft: 'auto',
      height: '100vh',
      maxWidth: 726,
      flex: 1,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926,
      },
    },
    loading: {
      left: 'calc(50% - 20px)',
      position: 'absolute',
      top: 100,
    },
  }),
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Search() {
  const style = useStyles();

  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);

  return (
    <Layout>
      <Grid item className={style.user}>
        <Grid container direction="row" justify="flex-start" alignContent="flex-start">
          <Grid item className={style.fullwidth}>
            <UserDetail isAnonymous={anonymous} />
          </Grid>
          <Grid item className={style.fullwidth}>
            <NoSsr>
              <Wallet />
            </NoSsr>
            <TopicComponent />
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={style.content}>
        <SearchTimeline isAnonymous={anonymous} />
      </Grid>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const {headers} = req;

  const dispatch = store.dispatch as ThunkDispatchAction;

  if (typeof window === 'undefined' && headers['user-agent']) {
    const DeviceDetect = eval('require("node-device-detector")');

    const device = new DeviceDetect();
    const {
      device: {type},
    } = device.detect(headers['user-agent']);

    if (type === 'smartphone') {
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
