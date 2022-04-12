import React from 'react';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {capitalize} from '@material-ui/core';

import {TimelineContainer} from 'src/components/Timeline/TimelineContainer';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {Experience} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';
import {initialize} from 'src/lib/api/base';
import * as ExperienceAPI from 'src/lib/api/experience';
import i18n from 'src/locale';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {fetchFriend} from 'src/reducers/friend/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {fetchPopularTopic} from 'src/reducers/tag/actions';
import {updateFilter} from 'src/reducers/timeline/actions';
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

type TopicPageProps = {
  experience: Experience | null;
};

type TopicsQueryProps = {
  tag?: string;
  type: 'hashtag' | 'experience';
};

const Topic: React.FC<TopicPageProps> = ({experience}) => {
  const {query} = useRouter();

  const {type, tag} = query as TopicsQueryProps;

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{i18n.t('Topics.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>

      <TopNavbarComponent
        description={type === 'hashtag' ? 'Topics' : 'Experience'}
        sectionTitle={
          type === 'hashtag' ? `#${capitalize(tag as string)}` : (experience?.name as string)
        }
      />

      <TimelineContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {query, req} = context;
  const dispatch = store.dispatch as ThunkDispatchAction;

  if (!['experience', 'hashtag'].includes(query.type as string)) {
    return {
      notFound: true,
    };
  }

  const session = await getSession(context);

  initialize({cookie: req.headers.cookie});

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
      dispatch(fetchPopularTopic()),
      dispatch(getUserCurrencies()),
      dispatch(fetchFriend()),
      dispatch(fetchUserWallets()),
    ]);
  }

  await dispatch(fetchNetwork());
  await dispatch(fetchExchangeRates());
  await dispatch(fetchUserExperience());

  let experience: Experience | null = null;

  if (query.type === 'experience') {
    if (!query.id) {
      return {
        notFound: true,
      };
    }

    try {
      const userExperience = await ExperienceAPI.getUserExperienceDetail(query.id as string);

      experience = userExperience.experience;

      await dispatch(
        updateFilter({
          tags: experience.allowedTags ? (experience.allowedTags as string[]) : [],
          people: experience.people
            .filter((person: People) => !person.hide)
            .map((person: People) => person.id),
        }),
      );
    } catch (error) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {
      session,
      experience,
    },
  };
});

export default Topic;
