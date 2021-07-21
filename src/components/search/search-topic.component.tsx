import React from 'react';

// import React, { useEffect } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';

import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// import { LoadingPage } from 'src/components/common/loading.component';
// import PostComponent from 'src/components/post/post.component';
// import { useTimelineFilter } from 'src/components/timeline/use-timeline-filter.hook';
// import { useTimeline } from 'src/context/timeline.context';

// import { useUser } from 'src/context/user.context';
// import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
// import { useTimelineHook } from 'src/hooks/use-timeline.hook';
// import { useToken } from 'src/hooks/use-token.hook';
// import { Post } from 'src/interfaces/post';
// import { Token } from 'src/interfaces/token';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926
      }
    },
    child: {
      '& > *': {
        margin: theme.spacing(1)
      }
    }
  })
);

type TopicSearchResultProps = {
  isAnonymous?: boolean;
};

const TopicSearchComponent: React.FC<TopicSearchResultProps> = () => {
  const style = useStyles();
  const { query } = useRouter();

  // const { state } = useTimeline();
  // const {
  //   state: { user }
  // } = useUser();
  // const { hasMore, nextPosts, sortTimeline } = useTimelineHook();
  // const { filterTimeline } = useTimelineFilter();
  // const { load, tokensReady } = usePolkadotApi();
  // const userId = user?.id as string;
  // const { loadAllUserTokens, userTokens: availableTokens } = useToken(userId);

  // useEffect(() => {
  //   loadAllUserTokens();
  // }, []);

  // // useEffect(() => {
  // //   filterTimeline(query);
  // // }, [query]);

  // const nextPage = () => {
  //   nextPosts();
  // };

  // const isOwnPost = (post: Post) => {
  //   if (!user) return false;

  //   if (post.platformUser?.platform_account_id === user.id) {
  //     return true;
  //   }

  //   return false;
  // };

  return (
    <div className={style.root}>
      <h1>Topic list component</h1>
      <Typography>{query.q}</Typography>
      {/* <div>
        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={state.posts.length}
          next={nextPage}
          hasMore={hasMore}
          loader={<LoadingPage />}>
          {state.posts.map((post: Post, i: number) => (
            <div key={post.id} id={`post-detail-${i}`}>
              <PostComponent
                post={post}
                postOwner={isOwnPost(post)}
                balanceDetails={tokensReady.length > 0 ? tokensReady : []}
                availableTokens={availableTokens}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div> */}
    </div>
  );
};

export default TopicSearchComponent;
