import React, {createRef, useCallback, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import Fab from '@material-ui/core/Fab';
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import DividerWithText from '../common/divider-w-text';
import {LoadingPage} from '../common/loading.component';
import FilterTimelineComponent from './filter/filter.component';
import {useStyles} from './timeline.style';
import {useTimelineFilter} from './use-timeline-filter.hook';

import {ScrollTop} from 'src/components/common/ScrollToTop.component';
import CreatePostComponent from 'src/components/post/create/create-post.component';
import PostComponent from 'src/components/post/post.component';
import {TipSummaryProvider} from 'src/components/tip-summary/tip-summary.context';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {useTimelineHook} from 'src/hooks/use-timeline.hook';
import {Post} from 'src/interfaces/post';
import {TimelineFilter} from 'src/interfaces/timeline';
import {Token} from 'src/interfaces/token';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const TipSummaryComponent = dynamic(
  () => import('src/components/tip-summary/tip-summary.component'),
);
const ImportPostComponent = dynamic(() => import('./ImportPost.component'));

type TimelineComponentProps = {
  isAnonymous: boolean;
  availableTokens: Token[];
  filter?: TimelineFilter;
};

const TimelineComponent: React.FC<TimelineComponentProps> = ({availableTokens}) => {
  const style = useStyles();
  const theme = useTheme();
  const {query} = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //TODO: move to redux
  const {load, tokensReady} = usePolkadotApi();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {posts, hasMore, sort, nextPage, sortTimeline} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter();

  const scrollRoot = createRef<HTMLDivElement>();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

  useEffect(() => {
    if (user?.id) {
      load(user.id, availableTokens);
    }
  }, [user]);

  const handleScroll = useCallback(() => {
    const distance = window.scrollY;

    if (distance <= 0) return;

    window.requestAnimationFrame(() => {
      if (scrollRoot.current) {
        scrollRoot.current.scroll(0, distance);
      }
    });
  }, []);

  const isOwnPost = (post: Post) => {
    if (!user) return false;

    if (post.platformUser?.platform_account_id === user.id) {
      return true;
    }

    return false;
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

        {!isMobile && <FilterTimelineComponent selected={sort} onChange={sortTimeline} />}

        <TipSummaryProvider>
          <div>
            <InfiniteScroll
              scrollableTarget="scrollable-timeline"
              className={style.child}
              dataLength={posts.length}
              next={nextPage}
              hasMore={hasMore}
              loader={<LoadingPage />}>
              {posts.map((post: Post, i: number) => (
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

export default TimelineComponent;
