// PROFILE PAGE
import React from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from '../src/components/Layout/Layout.container';

import ProfileTimeline from 'src/components/profile/profile.component';
import { useProfileHook } from 'src/components/profile/use-profile.hook';
import { healthcheck } from 'src/lib/api/healthcheck';

// import { getUserProfile } from 'src/lib/api/profile';

interface Params {
  id: string;
}

type Props = {
  session: Session | null;
  params: Params;
};

export default function Profile({ session, params }: Props) {
  const { profile, loading } = useProfileHook(params.id);

  if (!session) return null;
  return (
    <Layout session={session}>
      <ProfileTimeline user={session.user} profile={profile} loading={loading} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res, params } = context;
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

  // const exist = await getUserProfile(params?.id);

  // if (!exist || exist === null) {
  //   res.writeHead(301, { location: `${process.env.NEXTAUTH_URL}` });
  //   res.end();
  // }

  return {
    props: {
      session,
      params
    }
  };
};
