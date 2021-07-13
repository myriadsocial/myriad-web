import React, { createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Fab from '@material-ui/core/Fab';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import DividerWithText from '../common/divider-w-text';
import { LoadingPage } from '../common/loading.component';
import ImportPostComponent from './ImportPost.component';
import FilterTimelineComponent from './filter/filter.component';
import { useStyles } from './timeline.style';
import { useTimelineFilter } from './use-timeline-filter.hook';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import CreatePostComponent from 'src/components/post/create/create-post.component';
import PostComponent from 'src/components/post/post.component';
import { TipSummaryComponent } from 'src/components/tip-summary/tip-summary.component';
import { TipSummaryProvider } from 'src/components/tip-summary/tip-summary.context';
import { useTimeline } from 'src/context/timeline.context';
import { useUser } from 'src/context/user.context';
import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
import { useTimelineHook } from 'src/hooks/use-timeline.hook';
import { Post } from 'src/interfaces/post';
import { Token } from 'src/interfaces/token';

type TimelineProps = {
  isAnonymous: boolean;
  availableTokens: Token[];
};

const Timeline: React.FC<TimelineProps> = ({ availableTokens }) => {
  const style = useStyles();

  const [session] = useSession();
  const { query } = useRouter();

  const userAddress = session?.user.address as string;

  const { load, tokensReady } = usePolkadotApi();

  useEffect(() => {
    if (userAddress) {
      load(userAddress, availableTokens);
    }
  }, [userAddress]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    state: { user }
  } = useUser();
  const { state } = useTimeline();

  const { hasMore, nextPosts, sortTimeline } = useTimelineHook();
  const { filterTimeline } = useTimelineFilter();

  const scrollRoot = createRef<HTMLDivElement>();

  const isOwnPost = (post: Post) => {
    if (!user) return false;

    if (post.platformUser?.platform_account_id === user.id) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

  const handleScroll = useCallback(() => {
    const distance = window.scrollY;

    if (distance <= 0) return;

    window.requestAnimationFrame(() => {
      if (scrollRoot.current) {
        scrollRoot.current.scroll(0, distance);
      }
    });
  }, []);

  const nextPage = () => {
    nextPosts();
  };

  return (
    <div className={style.root} id="timeline">
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        {user && (
          <>
            <CreatePostComponent user={user} experiences={[]} />

            <DividerWithText>or</DividerWithText>

            <ImportPostComponent user={user} experiences={[]} />
          </>
        )}

        {!isMobile && <FilterTimelineComponent selected={state.sort} onChange={sortTimeline} />}

        <TipSummaryProvider>
          <div>
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
          </div>

          <TipSummaryComponent />
        </TipSummaryProvider>
        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </div>

      <div id="fb-root" />
    </div>
  );
};

export default Timeline;
