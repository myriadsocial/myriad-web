import React from 'react';

import {getSession} from 'next-auth/client';

import {PostContainer} from 'src/components-v2/PostDedicated/PostDedicated.container';
import {ResourceDeleted} from 'src/components-v2/ResourceDeleted';
import {ToasterContainer} from 'src/components-v2/atoms/Toaster/ToasterContainer';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import {DefaultLayout} from 'src/components-v2/template/Default/DefaultLayout';
import ShowIf from 'src/components/common/show-if.component';
import {PostVisibility} from 'src/interfaces/post';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as PostAPI from 'src/lib/api/post';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {setPost} from 'src/reducers/timeline/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

type PostPageProps = {
  removed: boolean;
};

type PostPageParams = {
  postId: string;
};

const PostPage: React.FC<PostPageProps> = ({removed}) => {
  return (
    <DefaultLayout isOnProfilePage={false}>
      <div style={{marginTop: '-20px'}}>
        <TopNavbarComponent description={'Post Detail'} sectionTitle={SectionTitle.TIMELINE} />
      </div>

      <ShowIf condition={removed}>
        <ResourceDeleted />
      </ShowIf>

      <ShowIf condition={!removed}>
        <PostContainer />
      </ShowIf>

      <ToasterContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const dispatch = store.dispatch as ThunkDispatchAction;
  const params = context.params as PostPageParams;
  let showAsDeleted = false;

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

  try {
    const post = await PostAPI.getPostDetail(params.postId);

    showAsDeleted =
      (Boolean(post.deletedAt) || post.visibility !== PostVisibility.PUBLIC) &&
      userId !== post.createdBy &&
      !post.importers.includes(userId);

    dispatch(setPost(post));
  } catch {
    return {
      notFound: true,
    };
  }

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
    ]);
  }

  return {
    props: {
      session,
      removed: showAsDeleted,
    },
  };
});

export default PostPage;
