import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Layout from 'src/components/Layout/Layout.container';
import ShowIf from 'src/components/common/show-if.component';
import { FriendsProvider } from 'src/components/friends/friends.context';
import Timeline from 'src/components/timeline/timeline.component';
import UserDetail from 'src/components/user/user.component';
import { useUser } from 'src/components/user/user.context';
import { Wallet } from 'src/components/wallet/wallet.component';
import { healthcheck } from 'src/lib/api/healthcheck';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    user: {
      flex: '0 0 327px',
      marginRight: 0,
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important'
    },
    wallet: {
      width: 327
    },
    fullheight: {
      height: '100vh'
    },
    profile: {
      flexGrow: 1
    },
    content: {
      // flex: '1 1 auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0 24px 0 24px',
      height: '100vh',
      maxWidth: 726,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926
      }
    }
  })
);

export default function Home() {
  const style = useStyles();

  const [session, loading] = useSession();
  const router = useRouter();

  const {
    state: { user }
  } = useUser();

  useEffect(() => {
    if (!session && !loading) {
      router.push('/');
    }
  }, [loading, session]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  if (!session?.user) return null;

  return (
    <Layout session={session}>
      {user && (
        <>
          <Grid item className={style.user}>
            <Grid className={style.fullheight} container direction="row" justify="flex-start" alignContent="flex-start">
              <Grid item className={style.profile}>
                <UserDetail user={user} />
              </Grid>
              <Grid item className={style.wallet}>
                <FriendsProvider>
                  <ShowIf condition={!user.anonymous}>
                    <NoSsr>
                      <Wallet />
                    </NoSsr>
                  </ShowIf>
                </FriendsProvider>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={style.content}>
            <Timeline user={user} />
          </Grid>
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;

  const available = await healthcheck();

  if (!available) {
    res.writeHead(302, { location: `${process.env.NEXTAUTH_URL}/maintenance` });
    res.end();
  }

  return {
    props: {
      session: await getSession(context)
    }
  };
};
