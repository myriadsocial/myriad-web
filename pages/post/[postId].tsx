import * as Sentry from '@sentry/nextjs';

import React from 'react';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import axios from 'axios';
import {PostDetailContainer} from 'src/components/PostDetail';
import {deserialize, formatToString} from 'src/components/PostEditor';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {ResourceDeleted} from 'src/components/common/ResourceDeleted';
import ShowIf from 'src/components/common/show-if.component';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {generateAnonymousUser} from 'src/helpers/auth';
import {FriendStatus} from 'src/interfaces/friend';
import {Post, PostVisibility} from 'src/interfaces/post';
import {Privacy} from 'src/interfaces/setting';
import {setHeaders} from 'src/lib/api/base';
import * as FriendAPI from 'src/lib/api/friends';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as PostAPI from 'src/lib/api/post';
import * as SettingAPI from 'src/lib/api/setting';
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
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

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

  const backToHome = () => {
    router.push('/home');
  };

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

      <TopNavbarComponent description={'Post Detail'} sectionTitle={SectionTitle.TIMELINE} />

      <ShowIf condition={removed}>
        <ResourceDeleted onBackClicked={backToHome} />
      </ShowIf>

      <ShowIf condition={!removed}>
        <PostDetailContainer />
      </ShowIf>
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const {headers} = req;
  const dispatch = store.dispatch as ThunkDispatchAction;
  const params = context.params as PostPageParams;
  let showAsDeleted = false;

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

  const anonymous = session?.user.anonymous || !session ? true : false;
  const userId = session?.user.address as string;
  let post: Post | undefined = undefined;

  try {
    post = await PostAPI.getPostDetail(params.postId, userId);
    const setting = await SettingAPI.getAccountSettings(post.createdBy);

    // TODO: remove this later when friend only post API changed
    if (!post.id) {
      throw new Error('Post invalid');
    }

    const upvoted = post.votes
      ? post.votes.filter(vote => vote.userId === userId && vote.state)
      : [];
    const downvoted = post.votes
      ? post.votes.filter(vote => vote.userId === userId && !vote.state)
      : [];

    post.isUpvoted = upvoted.length > 0;
    post.isDownVoted = downvoted.length > 0;

    if (post.platform === 'reddit') {
      post.text = post.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
    }
    // TODO: remove this later when friend only post API changed
    const importerIds = post.importers ? post.importers.map(importer => importer.id) : [];
    // show deleted post if the current user is the post creator or importer
    if (post.deletedAt) {
      showAsDeleted = userId !== post.createdBy && !importerIds.includes(userId);
    } else {
      if (post.visibility === PostVisibility.PRIVATE) {
        showAsDeleted = userId !== post.createdBy && !importerIds.includes(userId);
      }

      if (
        post.visibility === PostVisibility.FRIEND &&
        ((importerIds.length > 0 && !importerIds.includes(userId)) || post.createdBy !== userId)
      ) {
        const {data: requests} = await FriendAPI.checkFriendStatus(userId, [
          ...importerIds,
          post.createdBy,
        ]);

        showAsDeleted =
          requests.filter(request => request.status === FriendStatus.APPROVED).length === 0;
      }

      if (
        setting.accountPrivacy === Privacy.PRIVATE &&
        ((importerIds.length > 0 && !importerIds.includes(userId)) || post.createdBy !== userId)
      ) {
        const {data: requests} = await FriendAPI.checkFriendStatus(userId, [
          ...importerIds,
          post.createdBy,
        ]);

        showAsDeleted =
          requests.filter(request => request.status === FriendStatus.APPROVED).length === 0;
      }
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

  if (anonymous || !userId) {
    const username = generateAnonymousUser();

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userId));

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(getUserCurrencies()),
      dispatch(fetchFriend()),
    ]);
  }

  await dispatch(fetchExchangeRates());
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
