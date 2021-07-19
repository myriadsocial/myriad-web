// PROFILE PAGE
import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from 'src/components/Layout/Layout.container';
import ProfileTimeline from 'src/components/profile/profile.component';
import { useProfile } from 'src/components/profile/profile.context';
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
  const { state: profileState } = useProfile();
  const { isLoading, getProfile } = useProfileHook(params.id);
  const isAnonymous = !!session?.user.anonymous;

  const { getUserDetail } = useUserHook(session.user.address as string);

  useEffect(() => {
    getProfile();
  }, [params]);

  useEffect(() => {
    getUserDetail();
  }, []);

  if (!session) return null;

  return (
    <Layout session={session}>
      {userState && <ProfileTimeline isAnonymous={isAnonymous} user={userState.user} profile={profileState.profile} loading={isLoading} />}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res, params } = context;

  const available = await healthcheck();

  if (!available) {
    res.setHeader('location', '/maintenance');
    res.statusCode = 302;
    res.end();
  }

  const session = await getSession(context);

  if (!session) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  return {
    props: {
      params,
      session
    }
  };
};
