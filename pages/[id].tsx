import React from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from '../src/components/Layout/Layout.container';

import ProfileTimeline from 'src/components/profile/profile.component';
import { healthcheck } from 'src/lib/api/healthcheck';

type Props = {
  session: Session | null;
};

export default function Profile({ session }: Props) {
  if (!session) return null;
  return (
    <Layout session={session}>
      <ProfileTimeline user={session.user} />
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

  const available = await healthcheck();

  if (!available) {
    res.writeHead(302, { location: `${process.env.NEXTAUTH_URL}/maintenance` });
    res.end();
  }

  return {
    props: {
      session
    }
  };
};
