import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Layout from 'src/components/Layout/Layout.container';
import ConversationComponent from 'src/components/conversation/conversation.component';
import { useUser } from 'src/components/user/user.context';
import { Post } from 'src/interfaces/post';
import * as PostAPI from 'src/lib/api/post';

type Props = {
  post: Post;
};

export default function Conversation({ post }: Props) {
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

  return <Layout session={session}>{user && <ConversationComponent post={post} user={user} />}</Layout>;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res, params } = context;

  if (!params) {
    res.writeHead(301, { location: `${process.env.NEXTAUTH_URL}/home` });
    res.end();

    return {};
  }

  const post = await PostAPI.getPostDetail(params.slug as string);

  return {
    props: {
      session: await getSession(context),
      post
    }
  };
};
