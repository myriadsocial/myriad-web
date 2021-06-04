// PROFILE PAGE
import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from 'src/components/Layout/Layout.container';
import ProfileTimeline from 'src/components/profile/profile.component';
import { useProfileHook } from 'src/components/profile/use-profile.hook';
import { useUser } from 'src/context/user.context';
import { useUserHook } from 'src/hooks/use-user.hook';
import { healthcheck } from 'src/lib/api/healthcheck';

interface Params {
  id: string;
}

type Props = {
  session: Session;
  params: Params;
};

export default function Profile({ session, params }: Props) {
  const { state: userState } = useUser();
  const { profile, loading, getProfile } = useProfileHook(params.id);

  const { getUserDetail } = useUserHook(session.user.address as string);

  useEffect(() => {
    getProfile();
  }, [params]);

  useEffect(() => {
    getUserDetail();
  }, []);

  if (!session || !userState.user) return null;

  return <Layout session={session}>{userState && <ProfileTimeline user={userState.user} profile={profile} loading={loading} />}</Layout>;
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

  return {
    props: {
      session,
      params
    }
  };
};
