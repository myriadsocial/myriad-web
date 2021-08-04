import React, {useRef} from 'react';
import {useSelector} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/client';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import NoSsr from '@material-ui/core/NoSsr';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Layout from 'src/components/Layout/Layout.container';
import TopicComponent from 'src/components/topic/topic.component';
import UserDetail from 'src/components/user/user.component';
import {Wallet} from 'src/components/wallet/wallet.component';
import {useModal} from 'src/hooks/use-modal.hook';
import {useResize} from 'src/hooks/use-resize.hook';
import {Post} from 'src/interfaces/post';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {setPost} from 'src/reducers/timeline/actions';
import {TimelineState} from 'src/reducers/timeline/reducer';
import {setAnonymous, setUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';

const SendTipModal = dynamic(() => import('src/components/common/sendtips/SendTipModal'));
const TipSummaryComponent = dynamic(
  () => import('src/components/tip-summary/tip-summary.component'),
);
const PostComponent = dynamic(() => import('src/components/post/post.component'), {
  ssr: false,
});

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollbarColor: 'transparent transparent',
      '& ::-webkit-scrollbar': {
        display: 'none',
        width: '0 !important',
      },
    },
    user: {
      width: 327,
      flex: '0 0 327px',
      marginRight: 0,
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important',
    },
    fullwidth: {
      width: 327,
    },
    content: {
      flex: 1,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0 24px 0 24px',
      minHeight: '100vh',
      maxWidth: 726,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926,
      },
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    text: {
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: '23px',
      letterSpacing: '0em',
    },
  }),
);

type PostPageProps = {
  session: Session;
};

const PostPageComponent: React.FC<PostPageProps> = () => {
  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const style = useStyles();
  const sourceRef = useRef<HTMLDivElement | null>(null);
  const height = useResize(sourceRef);

  return (
    <Layout>
      <Grid item className={style.user}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignContent="flex-start"
          ref={sourceRef}>
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
      <Grid item className={style.content} style={{height}}>
        <DedicatedPost />
      </Grid>
    </Layout>
  );
};

const DedicatedPost = () => {
  const {user, tokens: availableTokens} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {post} = useSelector<RootState, TimelineState>(state => state.timelineState);
  const {isShown, toggle, hide} = useModal();
  const style = useStyles();
  const router = useRouter();

  const isOwnPost = (post: Post) => {
    if (!user) return false;
    if (post.platformUser?.platform_account_id === user.id) return true;
    return false;
  };

  const backtoTimeline = () => {
    router.push('/home');
  };

  if (!post) return null;
  return (
    <div className={style.root}>
      {user && (
        <SendTipModal
          isShown={isShown}
          hide={hide}
          availableTokens={availableTokens}
          userAddress={user.id}
        />
      )}
      <div className={style.flex}>
        <IconButton onClick={backtoTimeline} color="primary" aria-label="delete">
          <ArrowBackIcon />
        </IconButton>
        <Typography className={style.text}>{'Myriad Post'}</Typography>
      </div>

      <PostComponent post={post} postOwner={isOwnPost(post)} tippingClicked={toggle} />
      <TipSummaryComponent />
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {res, params} = context;
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
  const postId = params?.id as string;

  //TODO: this process should call thunk action creator instead of dispatch thunk acion
  //ISSUE: state not hydrated when using thunk action creator
  if (anonymous) {
    dispatch(setAnonymous(username));
  } else {
    const user = await UserAPI.getUserDetail(userId);
    dispatch(setUser(user));
  }

  const post = await PostAPI.getPostDetail(postId);

  if (post) {
    dispatch(setPost(post));
  }

  return {
    props: {
      session,
    },
  };
});

export default PostPageComponent;
