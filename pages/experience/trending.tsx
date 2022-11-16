import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import {ExperienceTab} from 'src/components/RightMenuBar/tabs/ExperienceTab';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {getServer} from 'src/lib/api/server';
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

type TrendingExperiencePageProps = {
  session: Session;
  logo: string;
};

const ExperiencePageComponent: React.FC<TrendingExperiencePageProps> = props => {
  const {loadTrendingExperience} = useExperienceHook();

  React.useEffect(() => {
    loadTrendingExperience();
  }, []);

  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{publicRuntimeConfig.appName} - Experience</title>
      </Head>

      <TopNavbarComponent
        sectionTitle={i18n.t('Section.Trending_Experience')}
        description={i18n.t('Section.Trending_Experience_Desc')}
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

  if (anonymous) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser());

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchUserWallets()),
    ]);
  }

  await dispatch(fetchNetwork());
  await dispatch(fetchUserExperience());
  const data = await getServer();

  return {
    props: {
      session,
      logo: data.images.logo_banner,
    },
  };
});

export default ExperiencePageComponent;
