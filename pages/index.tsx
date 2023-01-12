import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {Timeline} from 'components/Timeline/Timeline.layout';
import {SearchBoxContainer} from 'components/atoms/Search/SearchBoxContainer';
import {NavbarComponent} from 'src/components/Mobile/Navbar/Navbar';
import {RichTextContainer} from 'src/components/Richtext/RichTextContainer';
import {AppStatusBanner} from 'src/components/common/Banner';
import {TippingSuccess} from 'src/components/common/Tipping/render/Tipping.success';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {generateAnonymousUser} from 'src/helpers/auth';
import {initialize} from 'src/lib/api/base';
import * as ExperienceAPI from 'src/lib/api/experience';
import {healthcheck} from 'src/lib/api/healthcheck';
import {getServer} from 'src/lib/api/server';
import i18n from 'src/locale';
import {fetchAvailableToken, fetchFilteredToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {fetchFriend} from 'src/reducers/friend/actions';
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

type HomePageProps = {
  session: Session;
  logo: string;
  title: string;
  description: string;
  image: string;
};

const Index: React.FC<HomePageProps> = props => {
  const {title, description, image} = props;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{i18n.t('Home.Title', {appname: publicRuntimeConfig.appName})}</title>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={publicRuntimeConfig.appAuthURL + router.asPath} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="2024" />
        <meta property="og:image:height" content="1012" />
        <meta property="og:image:secure_url" content={image} />
        {/* Twitter Card tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <DefaultLayout isOnProfilePage={false} {...props}>
        <NavbarComponent {...props} />

        <SearchBoxContainer hidden={true} />

        <RichTextContainer />

        <Timeline />

        <TippingSuccess />

        <AppStatusBanner />
      </DefaultLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const params = context.query;
  const dispatch = store.dispatch as ThunkDispatchAction;

  const available = await healthcheck();

  if (!available) {
    return {
      redirect: {
        destination: '/maintenance',
        permanent: false,
      },
    };
  }

  const session = await getSession(context);

  const anonymous = Boolean(session?.user.anonymous) || !session;

  initialize({cookie: req.headers.cookie}, anonymous);

  if (anonymous) {
    const username = generateAnonymousUser();

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser());

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchUserWallets()),
      dispatch(countNewNotification()),
      dispatch(fetchFriend()),
    ]);
  }

  await Promise.all([
    dispatch(fetchAvailableToken()),
    dispatch(fetchFilteredToken()),
    dispatch(fetchNetwork()),
    dispatch(fetchExchangeRates()),
  ]);

  await dispatch(fetchUserExperience());

  let description = 'Home Page',
    title = 'Myriad - Home',
    image =
      'https://storage.googleapis.com/myriad-social-mainnet.appspot.com/assets/myriad_logo.svg',
    experience = null;

  if (params.type && params.type === 'experience') {
    const exp = await ExperienceAPI.getExperienceDetail(params.id as string);
    experience = exp;
    description =
      exp?.description ??
      'The owner might be changed their privacy settings, shared it for certain group of people or it’s been deleted';
    title = exp ? exp?.name : 'We cannot find what you are looking for';
    image = exp ? exp.experienceImageURL : null;
  }

  const data = await getServer();

  return {
    props: {
      session,
      logo: data.images.logo_banner,
      description,
      title,
      image,
      experience,
    },
  };
});

export default Index;
