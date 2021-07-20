import React from 'react';

import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import { wrapper } from '../src/store';

import Layout from 'src/components/Layout/Layout.container';
import ProfileTimeline from 'src/components/profile/profile.component';
import { ExtendedUserPost } from 'src/interfaces/user';
import { healthcheck } from 'src/lib/api/healthcheck';
import * as ProfileAPI from 'src/lib/api/profile';
import * as UserAPI from 'src/lib/api/user';
import { setAnonymous, setUser } from 'src/reducers/user/actions';

type ProfilePageProps = {
  session: Session;
  profile: ExtendedUserPost;
};

const ProfilePageComponent: React.FC<ProfilePageProps> = ({ profile }) => {
  return (
    <Layout>
      <ProfileTimeline profile={profile} loading={false} />
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const { res, params } = context;
  const { dispatch } = store;

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

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.id as string;
  const username = session?.user.name as string;
  const profileId = params?.id as string;

  //TODO: this process should call thunk action creator instead of dispatch thunk acion
  //ISSUE: state not hydrated when using thunk action creator
  if (anonymous) {
    dispatch(setAnonymous(username));
  } else {
    const user = await UserAPI.getUserDetail(userId);

    dispatch(setUser(user));
  }

  const profile = await ProfileAPI.getUserProfile(profileId);

  return {
    props: {
      session,
      profile
    }
  };
});

export default ProfilePageComponent;
