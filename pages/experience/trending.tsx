import React from 'react';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';

import {ExperienceTab} from 'src/components/RightMenuBar/tabs/ExperienceTab';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import i18n from 'src/locale';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {
  setAnonymous,
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

const ExperiencePageComponent: React.FC = () => {
  const {loadTrendingExperience} = useExperienceHook();

  React.useEffect(() => {
    loadTrendingExperience();
  }, []);

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{publicRuntimeConfig.appName} - Experience</title>
      </Head>

      <TopNavbarComponent
        description={SectionTitle.TRENDING_EXPERIENCE}
        sectionTitle={i18n.t('Section.Trending_Experience')}
        type={'menu'}
      />

      <ExperienceTab experienceType="trending" />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const dispatch = store.dispatch as ThunkDispatchAction;
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;

  if (anonymous || !userId) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userId));

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchUserWallets()),
    ]);
  }

  await dispatch(fetchNetwork());
  await dispatch(fetchUserExperience());

  return {
    props: {
      session,
    },
  };
});

export default ExperiencePageComponent;
