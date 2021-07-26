// SEARCH PAGE
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Layout from 'src/components/Layout/Layout.container';
import {LoadingBasic} from 'src/components/common/LoadingBasic.component';
import SearchResultComponent from 'src/components/search/search-result.component';
import TopicComponent from 'src/components/topic/topic.component';
import UserDetail from 'src/components/user/user.component';
import {Wallet} from 'src/components/wallet/wallet.component';
import {useMyriadUser} from 'src/hooks/use-myriad-users.hooks';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {setAnonymous, setUser, fetchToken} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';

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

type Props = {
  session: Session;
};

export default function Search({session}: Props) {
  const style = useStyles();
  const dispatch = useDispatch();

  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);

  useEffect(() => {
    // load current authenticated user tokens
    dispatch(fetchToken());
  }, [dispatch]);

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

type SearchTimelineProps = {
  isAnonymous: boolean;
};

const SearchTimeline: React.FC<SearchTimelineProps> = ({isAnonymous}) => {
  const router = useRouter();

  const {searching, backToTimeline, users: options, search} = useMyriadUser();
  const [loading, setLoading] = useState(false);

  const delayLoading = 2000;

  useEffect(() => {
    if (searching) {
      loadingSequence();
    }
  }, [searching]);

  useEffect(() => {
    search(`${router.query.q}`);
  }, [router.query.q]);

  const handleClick = () => {
    backToTimeline();
    router.push('/home');
  };

  const loadingSequence = () => {
    setLoading(true);
    const timeoutID = setTimeout(() => {
      setLoading(false);
    }, delayLoading);

    return () => {
      clearTimeout(timeoutID);
    };
  };

  return (
    <>
      <div id="search-result">
        {loading ? (
          <LoadingBasic />
        ) : (
          <SearchResultComponent loading={loading} options={options} clickBack={handleClick} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {res} = context;
  const {dispatch} = store;

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
  const userId = session?.user.id as string;
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
