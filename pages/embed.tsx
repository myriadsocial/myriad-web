import React from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {stringify} from 'components/PostCreate/formatter';
import {PostDetailContainer} from 'components/PostDetail/PostDetail.container';
import {generateAnonymousUser} from 'src/helpers/auth';
import {Post, PostVisibility} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import * as PostAPI from 'src/lib/api/post';
import {RootState} from 'src/reducers';
import {setPost} from 'src/reducers/timeline/actions';
import {setAnonymous} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

type EmbedType = 'post' | 'profile';

type PostEmbedProps = {
  type: EmbedType;
  title: string;
  description: string;
  image: string | null;
};

type PostEmbedParams = {
  id: string;
  type: EmbedType;
};

const PostEmbed: React.FC<PostEmbedProps> = props => {
  const {title, description, image} = props;

  const router = useRouter();
  const user = useSelector<RootState, User>(state => state.userState.user);
  const post = useSelector<RootState, Post>(state => state.timelineState.post);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta name="og:url" content={publicRuntimeConfig.appAuthURL + router.asPath} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        {image && <meta name="og:image" content={image} />}
        <meta name="og:type" content="website" />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        <meta name="twitter:card" content="summary" />
      </Head>

      <PostDetailContainer type="share" user={user} post={post} metric={post.metric} />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const dispatch = store.dispatch as ThunkDispatchAction;
  const {type, id} = context.query as PostEmbedParams;

  if (!['post', 'profile'].includes(type)) {
    return {
      notFound: true,
    };
  }

  const username = generateAnonymousUser();

  try {
    const originPost = await PostAPI.getPostDetail(id);

    const post = {
      ...originPost,
      isUpvoted: false,
      isDownVoted: false,
      totalComment: originPost.metric.comments,
    };

    if (
      post.deletedAt ||
      post.visibility !== PostVisibility.PUBLIC ||
      post.isNSFW ||
      post.NSFWTag
    ) {
      return {
        notFound: true,
      };
    }

    await Promise.all([dispatch(setPost(post)), dispatch(setAnonymous(username))]);

    return {
      props: {
        type,
        title: post?.title ?? `${post.user.name} on ${publicRuntimeConfig.appName}`,
        description: post.platform === 'myriad' ? stringify(post) : post.text,
        image: null,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
});

export default PostEmbed;
