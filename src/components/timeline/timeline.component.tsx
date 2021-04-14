import React, { createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CircularProgress from '@material-ui/core/CircularProgress';

import PostComponent from './post/post.component';
import { useStyles } from './timeline.style';
import { usePost } from './use-post.hooks';

import { Post, Comment } from 'src/interfaces/post';

const Timeline = () => {
  const style = useStyles();

  const { posts, loadMorePost, reply, loadComments } = usePost();
  const scrollRoot = createRef<HTMLDivElement>();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
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

  const handleReply = (comment: Comment) => {
    reply(comment.postId, comment);
  };

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={posts.length + 100}
          next={loadMorePost}
          hasMore={true}
          loader={<CircularProgress className={style.loading} disableShrink />}>
          {posts.map((post: Post, i: number) => (
            <PostComponent post={post} open={false} key={i} reply={handleReply} loadComments={loadComments} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Timeline;
