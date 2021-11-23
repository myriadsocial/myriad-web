import React from 'react';

import {getSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import {capitalize} from '@material-ui/core';

import {TimelineContainer} from 'src/components-v2/Timeline/TimelineContainer';
import {ToasterContainer} from 'src/components-v2/atoms/Toaster/ToasterContainer';
import {TopNavbarComponent} from 'src/components-v2/atoms/TopNavbar';
import {DefaultLayout} from 'src/components-v2/template/Default/DefaultLayout';
import {Experience} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';
import * as ExperienceAPI from 'src/lib/api/experience';
import {healthcheck} from 'src/lib/api/healthcheck';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {fetchPopularTopic} from 'src/reducers/tag/actions';
import {updateFilter} from 'src/reducers/timeline/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

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
      <TopNavbarComponent
        description={type === 'hashtag' ? 'Topics' : 'Experience'}
        sectionTitle={
          type === 'hashtag' ? `#${capitalize(tag as string)}` : (experience?.name as string)
        }
      />

      <TimelineContainer enableFilter={false} />

      <ToasterContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {query} = context;
  const dispatch = store.dispatch as ThunkDispatchAction;

  if (!['experience', 'hashtag'].includes(query.type as string)) {
    return {
      notFound: true,
    };
  }

  if (typeof window === 'undefined') {
    const DeviceDetect = eval('require("node-device-detector")');

    const device = new DeviceDetect();
    const {
      device: {type},
    } = device.detect(context.req.headers['user-agent']);

    if (type === 'smartphone') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers: context.req.headers,
        },
      };
    }
  }

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
      dispatch(fetchExperience()),
      dispatch(fetchPopularTopic()),
    ]);
  }

  let experience: any | null = null;

  if (query.type === 'experience') {
    if (!query.id) {
      return {
        notFound: true,
      };
    }

    try {
      experience = await ExperienceAPI.getExperience(query.id as string);

      await dispatch(
        updateFilter({
          tags: experience.tags ? (experience.tags as string[]) : [],
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
