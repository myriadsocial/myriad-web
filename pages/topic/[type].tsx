import React from 'react';
import {useSelector} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {capitalize} from '@material-ui/core';

import {PostsListContainer} from 'src/components/PostList';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {Experience} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';
import {User} from 'src/interfaces/user';
import {initialize} from 'src/lib/api/base';
import * as ExperienceAPI from 'src/lib/api/experience';
import {getServer} from 'src/lib/api/server';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchAvailableToken, fetchFilteredToken} from 'src/reducers/config/actions';
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
  session: Session;
  logo: string;
};

type TopicsQueryProps = {
  tag?: string;
  type: 'hashtag' | 'experience';
};

const Topic: React.FC<TopicPageProps> = props => {
  const {experience} = props;
  const {query} = useRouter();

  const {type, tag} = query as TopicsQueryProps;

  const user = useSelector<RootState, User>(state => state.userState.user);

  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{i18n.t('Topics.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>

      <TopNavbarComponent
        description={type === 'hashtag' ? 'Topics' : 'Experience'}
        sectionTitle={
          type === 'hashtag' ? `#${capitalize(tag as string)}` : (experience?.name as string)
        }
      />

      <PostsListContainer user={user} query={query} />
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

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const anonymous = !session || Boolean(session?.user.anonymous);

  initialize({cookie: req.headers.cookie}, anonymous);

  if (anonymous) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser());

    await Promise.all([
      dispatch(fetchUserWallets()),
      dispatch(fetchConnectedSocials()),
      dispatch(fetchFriend()),
      dispatch(countNewNotification()),
    ]);
  }

  await Promise.all([
    dispatch(fetchNetwork()),
    dispatch(fetchAvailableToken()),
    dispatch(fetchFilteredToken()),
    dispatch(fetchExchangeRates()),
    dispatch(fetchUserExperience()),
    dispatch(fetchPopularTopic()),
  ]);

  await dispatch(fetchNetwork());
  await dispatch(fetchExchangeRates());
  await dispatch(fetchUserExperience());

  const data = await getServer();

  let experience: Experience | null = null;

  if (query.type === 'hashtag' && query.tag) {
    await dispatch(
      updateFilter({
        tags: Array.isArray(query.tag) ? query.tag : [query.tag],
      }),
    );
  }

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
      logo: data.images.logo_banner,
    },
  };
});

export default Topic;
