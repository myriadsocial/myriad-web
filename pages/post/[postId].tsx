import React from 'react';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {PostContainer} from 'src/components-v2/PostDedicated/PostDedicated.container';
import {formatToString} from 'src/components-v2/PostEditor';
import {ResourceDeleted} from 'src/components-v2/ResourceDeleted';
import {ToasterContainer} from 'src/components-v2/atoms/Toaster/ToasterContainer';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import {DefaultLayout} from 'src/components-v2/template/Default/DefaultLayout';
import ShowIf from 'src/components/common/show-if.component';
import {FriendStatus} from 'src/interfaces/friend';
import {Post, PostVisibility} from 'src/interfaces/post';
import * as FriendAPI from 'src/lib/api/friends';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as PostAPI from 'src/lib/api/post';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {setPost} from 'src/reducers/timeline/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
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

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta name="og:url" content={publicRuntimeConfig.nextAuthURL + router.asPath} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        {image && <meta name="og:image" content={image} />}
        <meta name="og:type" content="website" />
        <meta name="fb:app_id" content={publicRuntimeConfig.facebookAppId} />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        <meta name="twitter:card" content="summary" />
      </Head>

      <TopNavbarComponent description={'Post Detail'} sectionTitle={SectionTitle.TIMELINE} />

      <ShowIf condition={removed}>
        <ResourceDeleted />
      </ShowIf>

      <ShowIf condition={!removed}>
        <PostContainer />
      </ShowIf>

      <ToasterContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const dispatch = store.dispatch as ThunkDispatchAction;
  const params = context.params as PostPageParams;
  let showAsDeleted = false;

  if (typeof window === 'undefined') {
    const DeviceDetect = eval('require("node-device-detector")');

    const device = new DeviceDetect();
    const {
      device: {type},
    } = device.detect(context.req.headers['user-agent']);

    if (type === 'smartphone') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers: context.req.headers,
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
  let post: Post;

  try {
    post = await PostAPI.getPostDetail(params.postId, userId);

    const importerIds = post.importers ? post.importers.map(importer => importer.id) : [];

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
    }

    dispatch(setPost(post));
  } catch {
    return {
      notFound: true,
    };
  }

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
      title: post?.title ?? `${post.user.name} on ${publicRuntimeConfig.appName}`,
      description: post.platform === 'myriad' ? formatToString(post) : post.text,
      image: null,
      removed: showAsDeleted,
    },
  };
});

export default PostPage;
