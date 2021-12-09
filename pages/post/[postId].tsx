import React from 'react';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {PostContainer} from 'src/components-v2/PostDedicated/PostDedicated.container';
import {deserialize, formatToString} from 'src/components-v2/PostEditor';
import {ResourceDeleted} from 'src/components-v2/ResourceDeleted';
import {ToasterContainer} from 'src/components-v2/atoms/Toaster/ToasterContainer';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import {DefaultLayout} from 'src/components-v2/template/Default/DefaultLayout';
import ShowIf from 'src/components/common/show-if.component';
import {generateAnonymousUser} from 'src/helpers/auth';
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
        <meta property="og:type" content="article" />
        <meta property="og:url" content={publicRuntimeConfig.nextAuthURL + router.asPath} />
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
  const {req} = context;
  const {headers} = req;
  const dispatch = store.dispatch as ThunkDispatchAction;
  const params = context.params as PostPageParams;
  let showAsDeleted = false;

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

  const anonymous = session ? false : true;
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
    const username = generateAnonymousUser();

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

  let description = post.text;

  if (post.platform === 'myriad') {
    const nodes = deserialize(post);

    description = nodes.map(formatToString).join('');
  }

  return {
    props: {
      session,
      title: post?.title ?? `${post.user.name} on ${publicRuntimeConfig.appName}`,
      description,
      image: post.asset?.images && post.asset.images.length > 0 ? post.asset.images[0] : null,
      removed: showAsDeleted,
    },
  };
});

export default PostPage;
