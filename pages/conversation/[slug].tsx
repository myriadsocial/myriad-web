import React from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from 'src/components/Layout/Layout.container';
import ConversationComponent from 'src/components/conversation/conversation.component';
import { Post } from 'src/interfaces/post';
import * as PostAPI from 'src/lib/api/post';

type Props = {
  session: Session | null;
  post: Post;
};

export default function Conversation({ session, post }: Props) {
  if (!session?.user) return null;

  return (
    <Layout session={session}>
      <ConversationComponent post={post} user={session.user} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res, params } = context;
  const session = await getSession(context);

  if (!session) {
    res.writeHead(301, { location: `${process.env.NEXTAUTH_URL}` });
    res.end();

    return {};
  }

  if (!params) {
    res.writeHead(301, { location: `${process.env.NEXTAUTH_URL}/home` });
    res.end();

    return {};
  }

  const post = await PostAPI.getPostDetail(params.slug as string);

  return {
    props: {
      session,
      post
    }
  };
};
