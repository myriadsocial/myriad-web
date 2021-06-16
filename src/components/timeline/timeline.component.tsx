import React, { useState, createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
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
import SearchResultComponent from 'src/components/search/search-result.component';
import { useTimeline } from 'src/context/timeline.context';
import { useUser } from 'src/context/user.context';
import { useMyriadUser } from 'src/hooks/use-myriad-users.hooks';
import { useTimelineHook } from 'src/hooks/use-timeline.hook';
import { Post } from 'src/interfaces/post';

type TimelineProps = {
  isAnonymous: boolean;
};

const Timeline: React.FC<TimelineProps> = ({ isAnonymous }) => {
  const style = useStyles();

  const { searching, backToTimeline, users: options } = useMyriadUser();

  const [loading, setLoading] = useState(false);

  const delayLoading = 2000;
  const loadingSequence = () => {
    setLoading(true);
    let timeoutID = setTimeout(() => {
      setLoading(false);
    }, delayLoading);

    return () => {
      clearTimeout(timeoutID);
    };
  };

  useEffect(() => {
    if (searching) {
      loadingSequence();
    }
  }, [searching]);

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

  const handleClick = () => {
    loadingSequence();
    backToTimeline();
  };

  console.log('TIMELINE COMPONENT LOAD', hasMore);

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={style.loading} />
      </Grid>
    );
  };

  if (searching)
    return (
      <>
        {loading ? (
          <LoadingComponent />
        ) : (
          <SearchResultComponent isAnonymous={isAnonymous} user={user} users={options} clickBack={handleClick} />
        )}
      </>
    );

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

        <div>
          <InfiniteScroll
            scrollableTarget="scrollable-timeline"
            className={style.child}
            dataLength={state.posts.length}
            next={nextPage}
            hasMore={hasMore}
            loader={<LoadingPage />}>
            {state.posts.map((post: Post, i: number) => (
              <div key={i} id={`post-detail-${i}`}>
                <PostComponent post={post} postOwner={isOwnPost(post)} />
              </div>
            ))}
          </InfiniteScroll>
        </div>

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
