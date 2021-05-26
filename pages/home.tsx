import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Layout from '../src/components/Layout/Layout.container';
import Timeline from '../src/components/timeline/timeline.component';

import { useUser } from 'src/components/user/user.context';
import { healthcheck } from 'src/lib/api/healthcheck';

export default function Home() {
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

  return <Layout session={session}>{user && <Timeline user={user} />}</Layout>;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;

  const available = await healthcheck();

  if (!available) {
    res.writeHead(302, { location: `${process.env.NEXTAUTH_URL}/maintenance` });
    res.end();
  }

  return {
    props: {
      session: await getSession(context)
    }
  };
};
