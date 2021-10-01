import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/client';

import {DefaultLayout} from '../../src/components-v2/template/Default/DefaultLayout';
import {wrapper} from '../../src/store';

import {UserMenuContainer} from 'src/components-v2/UserMenu';
import ProfileTimeline from 'src/components/profile/profile.component';
import {User} from 'src/interfaces/user';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {setProfile} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {setAnonymous, setUser, fetchConnectedSocials} from 'src/reducers/user/actions';

type ProfilePageProps = {
  session: Session;
  profile: User | null;
};

const ProfilePageComponent: React.FC<ProfilePageProps> = ({profile}) => {
  const dispatch = useDispatch();

  const {detail: profileDetail} = useSelector<RootState, ProfileState>(state => state.profileState);

  useEffect(() => {
    dispatch(fetchConnectedSocials());
    dispatch(fetchAvailableToken());
  }, [dispatch]);

  return (
    <DefaultLayout isOnProfilePage={true}>
      {profileDetail && <ProfileTimeline profile={profileDetail} loading={false} />}
      <UserMenuContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {res, params} = context;
  const {dispatch} = store;

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
  const userId = session?.user.address as string;
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

  const profile = await UserAPI.getUserDetail(profileId);

  if (profile) {
    dispatch(setProfile(profile));
  }

  return {
    props: {
      session,
      profile,
    },
  };
});

export default ProfilePageComponent;
