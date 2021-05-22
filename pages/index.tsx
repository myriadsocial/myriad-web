import React, { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import LoginForm from 'src/components/login/login.component';
import PostComponent from 'src/components/timeline/post/post.component';
import Logo from 'src/images/logo.svg';
import { Post, Comment } from 'src/interfaces/post';
import { healthcheck } from 'src/lib/api/healthcheck';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'linear-gradient(110.43deg, #A942E9 0%, rgba(255, 255, 255, 0) 100.48%), #FFFFFF',
      padding: '24px 36px',
      minHeight: '100vh'
    },
    logo: {
      marginRight: theme.spacing(1.5)
    },
    info: {
      width: 328,
      background: 'rgba(255, 255, 255, 0.41)',
      borderRadius: 15,
      padding: theme.spacing(2),
      color: '#000000'
    },
    login: {
      marginTop: 140,
      width: 320,
      marginRight: 65
    },
    timeline: {
      padding: '16px 24px!important',
      position: 'relative',
      backgroundImage: 'url(/images/timeline.svg)',
      backgroundSize: 'cover',
      '& > div': {
        marginBottom: 10
      }
    }
  })
);

export default function Index() {
  const style = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session && !loading) {
      router.push('/home');
    }
  }, [loading, session]);

  useEffect(() => {
    if (router.query.error) {
      if (Array.isArray(router.query.error)) {
        setError(router.query.error[0]);
      } else {
        setError(router.query.error);
      }
    } else {
      setError(null);
    }
  }, [router.query.error]);

  const closeAlert = () => {
    setError(null);
    router.replace('/', undefined, { shallow: true });
  };

  const reply = (comment: Comment) => {};

  const loadComments = (postId: string) => {};

  const posts: Post[] = [
    {
      id: '1',
      link: 'https://twitter.com/DocumentingBTC/status/1376217381186457601',
      textId: '1376217381186457601',
      platform: 'twitter',
      tags: ['bitcoin'],
      hasMedia: false,
      platformCreatedAt: new Date(),
      comments: [
        {
          text: 'hear! hear!',
          postId: '1',
          userId: '1',
          createdAt: new Date()
        }
      ],
      createdAt: new Date()
    },
    {
      id: '2',
      link: 'https://twitter.com/CharmaineSChua/status/1375868552129863681',
      textId: '1375868552129863681',
      platform: 'twitter',
      tags: ['politic', 'viral'],
      hasMedia: false,
      platformCreatedAt: new Date(),
      comments: [],
      createdAt: new Date()
    }
  ];

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  return (
    <div className={style.root}>
      <Grid container spacing={3} justify="space-around">
        <Grid container item md={6} lg={6} direction="column" spacing={3}>
          <Grid container item direction="row">
            <Logo className={style.logo} />
            <Paper className={style.info}>
              <Typography>
                A social platform that’s entirely under your control. Remain anonymous, look for your own topics, choose your interface and
                control what you see.
              </Typography>
            </Paper>
          </Grid>
          <Grid item className={style.timeline}>
            {posts.map(post => (
              <PostComponent post={post} open={true} disable key={post.id} reply={reply} loadComments={loadComments} />
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <div className={style.login}>
            <LoginForm />
          </div>
        </Grid>
      </Grid>

      <Snackbar
        style={{
          width: '200px'
        }}
        open={error !== null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        autoHideDuration={6000}
        onClose={closeAlert}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {router.query.error}
        </Alert>
      </Snackbar>
    </div>
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
