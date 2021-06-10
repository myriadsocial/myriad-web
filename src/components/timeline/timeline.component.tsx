import React, { useState, createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import DividerWithText from '../common/divider-w-text';
import { LoadingPage } from '../common/loading.component';
import { useExperience } from '../experience/use-experience.hooks';
import ImportPostComponent from './ImportPost.component';
import { CommentProvider } from './comment/comment.context';
import CreatePostComponent from './create-post/create-post.component';
import FilterTimelineComponent from './filter/filter.component';
import PostComponent from './post/post.component';
import { useStyles } from './timeline.style';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import ShowIf from 'src/components/common/show-if.component';
import SearchResultComponent from 'src/components/search/search-result.component';
import { useTimeline } from 'src/context/timeline.context';
import { useMyriadUser } from 'src/hooks/use-myriad-users.hooks';
import { usePost } from 'src/hooks/use-post.hook';
import { Post, PostSortMethod } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';

type TimelineProps = {
  user: User;
};

const Timeline: React.FC<TimelineProps> = ({ user }) => {
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

    return;
  }, [searching]);

  const { state } = useTimeline();
  const { hasMore, loadUserPost, loadMorePost, sortBy, addPost, importPost } = usePost(user);
  const { experiences } = useExperience(user.id);
  const scrollRoot = createRef<HTMLDivElement>();

  const isOwnPost = (post: Post) => {
    if (post.walletAddress === user.id) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    loadUserPost();
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
    loadMorePost();
  };

  const sortTimeline = (sort: PostSortMethod) => {
    sortBy(sort);
  };

  const submitPost = (text: string, tags: string[], files: File[]) => {
    addPost(text, tags, files);
  };

  const submitImportPost = (URL: string) => {
    importPost(URL);
  };

  const handleClick = () => {
    loadingSequence();
    backToTimeline();
  };

  console.log('TIMELINE COMPONENT LOAD');

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={style.loading} />
      </Grid>
    );
  };

  return (
    <div className={style.root}>
      {loading ? (
        <LoadingComponent />
      ) : searching ? (
        <SearchResultComponent user={user} users={options} clickBack={handleClick} />
      ) : (
        <>
          <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
            <ShowIf condition={!user.anonymous}>
              <CreatePostComponent onSubmit={submitPost} experiences={experiences} user={user} />

              <DividerWithText>or</DividerWithText>

              <ImportPostComponent onSubmit={submitImportPost} experiences={experiences} />
            </ShowIf>

            <FilterTimelineComponent selected={state.sort} onChange={sortTimeline} />

            <CommentProvider>
              <InfiniteScroll
                scrollableTarget="scrollable-timeline"
                className={style.child}
                dataLength={state.posts.length + 100}
                next={nextPage}
                hasMore={hasMore}
                loader={<LoadingPage />}>
                {state.posts.map((post: Post, i: number) => (
                  <Grow key={i}>
                    <PostComponent post={post} open={false} postOwner={isOwnPost(post)} />
                  </Grow>
                ))}

                <ScrollTop>
                  <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                  </Fab>
                </ScrollTop>
              </InfiniteScroll>
            </CommentProvider>
          </div>

          <div id="fb-root" />
        </>
      )}
    </div>
  );
};

export default Timeline;
