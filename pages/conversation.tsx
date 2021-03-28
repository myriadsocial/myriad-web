import React from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from '../src/components/Layout/Layout.container';
import ConversationComponent from '../src/components/conversation/conversation.component';

type Props = {
  session: Session | null;
};

export default function Conversation({ session }: Props) {
  return (
    <Layout session={session}>
      <ConversationComponent />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;
  const session = await getSession(context);

  if (!session) {
    res.writeHead(301, { location: `${process.env.NEXTAUTH_URL}` });
    res.end();
  }

  return {
    props: {
      session
    }
  };
};
