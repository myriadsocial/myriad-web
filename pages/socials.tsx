import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {getSession} from 'next-auth/client';

import {SocialsContainer} from 'src/components-v2/Socials/Socials.container';
import {ToasterContainer} from 'src/components-v2/atoms/Toaster/ToasterContainer';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import {DefaultLayout} from 'src/components-v2/template/Default/DefaultLayout';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {setAnonymous, setUser, fetchConnectedSocials} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';

const Socials: React.FC = () => {
  const dispatch = useDispatch();
  const {socials} = useSelector<RootState, UserState>(state => state.userState);

  useEffect(() => {
    dispatch(fetchConnectedSocials());
    dispatch(fetchAvailableToken());
  }, [dispatch]);

  //TODO: any logic + components which replace
  // the middle column of home page should go here

  return (
    <DefaultLayout isOnProfilePage={false}>
      <ToasterContainer />
      <TopNavbarComponent
        description={`${socials.length} account connected`}
        sectionTitle={SectionTitle.SOCIAL_MEDIA}
      />

      <SocialsContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {dispatch} = store;
  const {res} = context;

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

  //TODO: this process should call thunk action creator instead of dispatch thunk acion
  //ISSUE: state not hydrated when using thunk action creator
  if (anonymous) {
    dispatch(setAnonymous(username));
  } else {
    const user = await UserAPI.getUserDetail(userId);

    dispatch(setUser(user));
  }

  return {
    props: {
      session,
    },
  };
});

export default Socials;
