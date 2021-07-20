// SEARCH PAGE
import React, { useState, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Layout from 'src/components/Layout/Layout.container';
import SearchResultComponent from 'src/components/search/search-result.component';
import TopicComponent from 'src/components/topic/topic.component';
import UserDetail from 'src/components/user/user.component';
import { Wallet } from 'src/components/wallet/wallet.component';
import { FriendsProvider } from 'src/context/friends.context';
import { useUser } from 'src/context/user.context';
import { useMyriadUser } from 'src/hooks/use-myriad-users.hooks';
import { healthcheck } from 'src/lib/api/healthcheck';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    user: {
      flex: '0 0 327px',
      width: 327,
      marginRight: 0,
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important'
    },
    wallet: {
      width: 327
    },
    fullwidth: {
      width: 327
    },
    fullheight: {
      height: '100vh'
    },
    profile: {
      flexGrow: 1
    },
    content: {
      padding: '0 24px 0 24px',
      marginRight: 'auto',
      marginLeft: 'auto',
      height: '100vh',
      maxWidth: 726,
      flex: 1,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926
      }
    },
    loading: {
      left: 'calc(50% - 20px)',
      position: 'absolute',
      top: 100
    }
  })
);

type Props = {
  session: Session;
};

export default function Search({ session }: Props) {
  const style = useStyles();
  const isAnonymous = !!session?.user.anonymous;

  return (
    <Layout>
      <Grid item className={style.user}>
        <Grid container direction="row" justify="flex-start" alignContent="flex-start">
          <Grid item className={style.fullwidth}>
            <UserDetail user={session.user} isAnonymous={isAnonymous} />
          </Grid>
          <Grid item className={style.fullwidth}>
            <FriendsProvider>
              <NoSsr>
                <Wallet />
              </NoSsr>
            </FriendsProvider>
            <TopicComponent />
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={style.content}>
        <SearchTimeline isAnonymous={isAnonymous} />
      </Grid>
    </Layout>
  );
}

type SearchTimelineProps = {
  isAnonymous: boolean;
};

const SearchTimeline: React.FC<SearchTimelineProps> = ({ isAnonymous }) => {
  const [loading, setLoading] = useState(false);
  const style = useStyles();
  const router = useRouter();
  const { searching, backToTimeline, users: options, search } = useMyriadUser();
  const {
    state: { user }
  } = useUser();
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

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={style.loading} />
      </Grid>
    );
  };

  return (
    <>
      <div id="search-result">
        {loading ? (
          <LoadingComponent />
        ) : (
          <SearchResultComponent isAnonymous={isAnonymous} user={user} users={options} clickBack={handleClick} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;
  const session = await getSession(context);

  if (!session) {
    res.writeHead(301, { location: `${process.env.NEXTAUTH_URL}` });
    res.end();
  }

  const available = await healthcheck();

  if (!available) {
    res.writeHead(302, { location: `${process.env.NEXTAUTH_URL}/maintenance` });
    res.end();
  }

  return {
    props: {
      session
    }
  };
};
