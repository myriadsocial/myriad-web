import React, { createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../common/loading.component';
import { useExperience } from '../experience/use-experience.hooks';
import ImportPostComponent from './ImportPost.component';
import { CommentProvider } from './comment/comment.context';
import CreatePostComponent from './create-post/create-post.component';
import FilterTimelineComponent from './filter/filter.component';
import PostComponent from './post/post.component';
import { useTimeline } from './timeline.context';
import { useStyles } from './timeline.style';
import { usePost } from './use-post.hook';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import ShowIf from 'src/components/common/show-if.component';
import { Post, PostSortMethod } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';

type TimelineProps = {
  user: User;
};

const Timeline: React.FC<TimelineProps> = ({ user }) => {
  const style = useStyles();

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

  console.log('TIMELINE COMPONENT LOAD');

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        {
          //<SearchUserComponent title="Search Myriad" data={options} search={searchUser} onSelected={onSearchUser} />
        }
        <ShowIf condition={!user.anonymous}>
          <CreatePostComponent onSubmit={submitPost} experiences={experiences} user={user} />

          <Divider component="span" style={{ margin: 8 }} />

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
    </div>
  );
};

export default Timeline;
