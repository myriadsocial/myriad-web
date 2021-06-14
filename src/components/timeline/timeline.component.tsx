import React, { createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import DividerWithText from '../common/divider-w-text';
import { LoadingPage } from '../common/loading.component';
import ImportPostComponent from './ImportPost.component';
import FilterTimelineComponent from './filter/filter.component';
import { useStyles } from './timeline.style';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import CreatePostComponent from 'src/components/post/create/create-post.component';
import PostComponent from 'src/components/post/post.component';
import { useTimeline } from 'src/context/timeline.context';
import { useUser } from 'src/context/user.context';
import { useTimelineHook } from 'src/hooks/use-timeline.hook';
import { Post } from 'src/interfaces/post';

type TimelineProps = {
  isAnonymous: boolean;
};

const Timeline: React.FC<TimelineProps> = ({ isAnonymous }) => {
  const style = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    state: { user }
  } = useUser();
  const { state } = useTimeline();

  const { hasMore, loadTimeline, nextPosts, sortTimeline } = useTimelineHook();
  const scrollRoot = createRef<HTMLDivElement>();

  const isOwnPost = (post: Post) => {
    if (!user) return false;

    if (post.walletAddress === user.id) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    loadTimeline();
  }, []);

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
    console.log('nextPage');
    nextPosts();
  };

  console.log('TIMELINE COMPONENT LOAD', hasMore);

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        {user && (
          <>
            <CreatePostComponent user={user} experiences={[]} />

            <DividerWithText>or</DividerWithText>

            <ImportPostComponent user={user} experiences={[]} />
          </>
        )}

        {!isMobile && <FilterTimelineComponent selected={state.sort} onChange={sortTimeline} />}

        <div id="timeline">
          <InfiniteScroll
            scrollableTarget="scrollable-timeline"
            className={style.child}
            dataLength={state.posts.length}
            next={nextPage}
            hasMore={hasMore}
            onScroll={() => console.log('scroll')}
            loader={<LoadingPage />}>
            {state.posts.map((post: Post, i: number) => (
              <Grow key={i}>
                <PostComponent post={post} postOwner={isOwnPost(post)} />
              </Grow>
            ))}

            <ScrollTop>
              <Fab color="secondary" size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </InfiniteScroll>
        </div>
      </div>

      <div id="fb-root" />
    </div>
  );
};

export default Timeline;
