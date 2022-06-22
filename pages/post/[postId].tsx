import * as Sentry from '@sentry/nextjs';

import React from 'react';

import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {useRouter} from 'next/router';

import axios from 'axios';
import {PostDetailContainer} from 'src/components/PostDetail';
import {deserialize, formatToString} from 'src/components/PostEditor';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {TippingSuccess} from 'src/components/common/Tipping/render/Tipping.success';
import ShowIf from 'src/components/common/show-if.component';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {generateAnonymousUser} from 'src/helpers/auth';
import {Post} from 'src/interfaces/post';
import {initialize} from 'src/lib/api/base';
import * as PostAPI from 'src/lib/api/post';
import i18n from 'src/locale';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
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
};

type PostPageParams = {
  postId: string;
};

const PostPage: React.FC<PostPageProps> = props => {
  const {removed, title, description, image} = props;

  const router = useRouter();

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={publicRuntimeConfig.appAuthURL + router.asPath} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        {image && <meta property="og:image" content={image} />}
        <meta property="fb:app_id" content={publicRuntimeConfig.facebookAppId} />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        <meta name="twitter:card" content="summary" />
      </Head>

      <ShowIf condition={!removed}>
        <TopNavbarComponent
          description={i18n.t('Post_Detail.Navbar.Title')}
          sectionTitle={i18n.t('Section.Timeline')}
        />
      </ShowIf>

      <ShowIf condition={removed}>
        <TopNavbarComponent
          description={i18n.t('Post_Detail.Navbar.Removed.Title')}
          sectionTitle={i18n.t('Post_Detail.Navbar.Removed.Description')}
        />

        <ResourceDeleted />
      </ShowIf>

      <ShowIf condition={!removed}>
        <PostDetailContainer />
      </ShowIf>
      <TippingSuccess />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const dispatch = store.dispatch as ThunkDispatchAction;
  const params = context.params as PostPageParams;
  let showAsDeleted = false;

  const session = await getSession(context);

  const anonymous = session?.user.anonymous || !session ? true : false;
  const userAddress = session?.user.address as string;

  let userId: string | undefined = undefined;
  let post: Post | undefined = undefined;

  initialize({cookie: req.headers.cookie}, anonymous);

  try {
    if (!anonymous) {
      // TODO: fix ThunkDispatch return type
      const user = (await dispatch(fetchUser(userAddress))) as any;
      userId = user?.id;
    }

    post = await PostAPI.getPostDetail(params.postId, userId);

    const upVotes = post.votes
      ? post.votes.filter(vote => vote.userId === userId && vote.state)
      : [];
    const downVotes = post.votes
      ? post.votes.filter(vote => vote.userId === userId && !vote.state)
      : [];
    post.isUpvoted = upVotes.length > 0;
    post.isDownVoted = downVotes.length > 0;

    if (post.platform === 'reddit') {
      post.text = post.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
    }

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
      dispatch(fetchConnectedSocials()),
      dispatch(countNewNotification()),
      dispatch(getUserCurrencies()),
      dispatch(fetchFriend()),
      dispatch(fetchUserWallets()),
    ]);
  }

  await Promise.all([
    dispatch(fetchAvailableToken()),
    dispatch(fetchNetwork()),
    dispatch(fetchExchangeRates()),
  ]);

  await dispatch(fetchUserExperience());

  let description =
    post?.text ??
    'The owner might be changed their privacy settings, shared it for certain group of people or it’s been deleted';
  let title = post
    ? post?.title ?? `${post.user.name} on ${publicRuntimeConfig.appName}`
    : 'We cannot find what you are looking for';
  let image = post
    ? post.asset?.images && post.asset.images.length > 0
      ? post.asset.images[0]
      : null
    : null;

  if (post && post.platform === 'myriad') {
    const nodes = deserialize(post);

    description = nodes.map(formatToString).join('');
  }

  if (post?.deletedAt || post?.isNSFW || post?.NSFWTag) {
    title = 'Login with Myriad Account';
    description = 'Log in to Myriad Social! Not a Myriad user? Sign up for free.';
    image = null;
  }

  return {
    props: {
      title,
      description,
      image,
      removed: showAsDeleted,
    },
  };
});

export default PostPage;
