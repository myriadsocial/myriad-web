// PROFILE PAGE
import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from '../src/components/Layout/Layout.container';

import ProfileTimeline from 'src/components/profile/profile.component';
import { useProfile } from 'src/components/profile/profile.context';
import { useProfileHook } from 'src/components/profile/use-profile.hook';
import { useUserHook } from 'src/components/user/use-user.hook';
import { useUser } from 'src/components/user/user.context';
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
  const { state: profileState } = useProfile();
  const { loading, getProfile } = useProfileHook(params.id);

  const { getUserDetail } = useUserHook(session.user.address as string);

  useEffect(() => {
    getProfile();
  }, [params]);

  useEffect(() => {
    getUserDetail();
  }, []);

  if (!session || !userState.user) return null;

  return (
    <Layout session={session}>
      {userState && <ProfileTimeline user={userState.user} profile={profileState.profile} loading={loading} />}
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

  return {
    props: {
      session,
      params
    }
  };
};
