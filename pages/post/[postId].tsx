import * as Sentry from '@sentry/nextjs';

import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {useRouter} from 'next/router';

import axios from 'axios';
import {stringify} from 'components/PostCreate/formatter';
import {PostDetailContainer} from 'components/PostDetail/PostDetail.container';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {TippingSuccess} from 'src/components/common/Tipping/render/Tipping.success';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {generateAnonymousUser} from 'src/helpers/auth';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {initialize} from 'src/lib/api/base';
import * as PostAPI from 'src/lib/api/post';
import {getServer} from 'src/lib/api/server';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchAvailableToken, fetchFilteredToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {fetchFriend} from 'src/reducers/friend/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {setPost} from 'src/reducers/timeline/actions';
import {
  setAnonymous,
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchNetwork,
  fetchUserWallets,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

const ResourceDeleted = dynamic(
  () => import('src/components/common/ResourceDeleted/ResourceDeleted'),
);

type PostPageProps = {
  removed: boolean;
  title: string;
  description: string;
  image: string | null;
  session: Session;
  logo: string;
};

type PostPageParams = {
  postId: string;
};

const PostPage: React.FC<PostPageProps> = props => {
  const {removed, title, description, image} = props;

  const router = useRouter();
  const user = useSelector<RootState, User>(state => state.userState.user, shallowEqual);
  const post = useSelector<RootState, Post>(state => state.timelineState.post, shallowEqual);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const vote = useSelector<RootState, number>(
    state =>
      state.timelineState.post?.metric?.upvotes - state.timelineState.post?.metric?.downvotes,
    shallowEqual,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const comments = useSelector<RootState, number>(
    state => state.timelineState.post?.metric?.comments,
    shallowEqual,
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={publicRuntimeConfig.appAuthURL + router.asPath} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:image:width" content="2024" />
        <meta property="og:image:height" content="1012" />
        <meta property="og:image:secure_url" content={image} />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <DefaultLayout isOnProfilePage={false} {...props}>
        <TopNavbarComponent
          description={i18n.t('Post_Detail.Navbar.Title')}
          sectionTitle={i18n.t('Section.Timeline')}
        />
        {removed ? (
          <ResourceDeleted />
        ) : (
          <PostDetailContainer post={post} user={user} expand metric={post.metric} preview />
        )}

        <TippingSuccess />
      </DefaultLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const dispatch = store.dispatch as ThunkDispatchAction;
  const params = context.params as PostPageParams;
  let showAsDeleted = false;

  const session = await getSession(context);

  const anonymous = !session || Boolean(session?.user.anonymous);

  let userId: string | undefined = undefined;
  let post: Post | undefined = undefined;

  initialize({cookie: req.headers.cookie}, anonymous);

  try {
    if (!anonymous) {
      // TODO: fix ThunkDispatch return type
      const user = (await dispatch(fetchUser())) as any;
      userId = user?.id;
    }

    const originPost = await PostAPI.getPostDetail(params.postId, userId);
    const upvotes = originPost.votes
      ? originPost.votes.filter(vote => vote.userId === userId && vote.state)
      : [];
    const downvotes = originPost.votes
      ? originPost.votes.filter(vote => vote.userId === userId && !vote.state)
      : [];

    post = {
      ...originPost,
      isUpvoted: upvotes.length > 0,
      isDownVoted: downvotes.length > 0,
      totalComment: originPost.metric.comments,
    };

    dispatch(setPost(post));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      showAsDeleted = true;
    } else {
      Sentry.captureException(error);

      return {
        notFound: true,
      };
    }
  }

  if (anonymous) {
    const username = generateAnonymousUser();

    await dispatch(setAnonymous(username));
  } else {
    await Promise.all([
      dispatch(fetchUserWallets()),
      dispatch(fetchConnectedSocials()),
      dispatch(fetchFriend()),
      dispatch(countNewNotification()),
    ]);
  }

  await Promise.all([
    dispatch(fetchNetwork()),
    dispatch(fetchAvailableToken()),
    dispatch(fetchFilteredToken()),
    dispatch(fetchExchangeRates()),
    dispatch(fetchUserExperience()),
  ]);

  let description =
    post?.text ??
    'The owner might be changed their privacy settings, shared it for certain group of people or it’s been deleted';
  let title = post
    ? post?.title ?? `${post.user.name} on ${publicRuntimeConfig.appName}`
    : 'We cannot find what you are looking for';
  let image = post
    ? post.asset?.images && post.asset.images.length > 0
      ? typeof post.asset.images[0] === 'string'
        ? post.asset.images[0]
        : post.asset.images[0].large
      : null
    : null;

  if (post?.platform === 'myriad') {
    const {text, image: imageData} = stringify(post);
    description = text;
    image = imageData;
  }

  if (post?.deletedAt || post?.isNSFW || post?.NSFWTag) {
    title = 'Login with Myriad Account';
    description = 'Log in to Myriad Social! Not a Myriad user? Sign up for free.';
    image = null;
  }

  const data = await getServer();

  return {
    props: {
      title,
      description,
      image,
      removed: showAsDeleted,
      logo: data.images.logo_banner,
    },
  };
});

export default PostPage;
