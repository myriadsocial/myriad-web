import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Image from 'next/image';

import Typography from '@material-ui/core/Typography';

import {PostDetail} from '../PostDetail';
import {useStyles} from './Timeline.styles';

import {Loading} from 'src/components-v2/atoms/Loading';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';

type TimelineProps = {
  user?: User;
  timelineType?: TimelineType;
  posts: Post[];
  anonymous: boolean;
  hasMore: boolean;
  upvote: (refrence: Post | Comment) => void;
  loadNextPage: () => void;
  onSendTip: (post: Post) => void;
  onOpenTipHistory: (post: Post) => void;
  onDelete: (post: Post) => void;
  onReport: (post: Post) => void;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
  onRemoveVote: (reference: Post | Comment) => void;
};

export const Timeline: React.FC<TimelineProps> = props => {
  const {
    user,
    timelineType,
    posts,
    anonymous,
    hasMore,
    loadNextPage,
    upvote,
    onSendTip,
    onOpenTipHistory,
    onDelete,
    onReport,
    onShared,
    toggleDownvoting,
    onRemoveVote,
  } = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        dataLength={posts.length}
        hasMore={hasMore}
        next={loadNextPage}
        loader={<Loading />}>
        {timelineType === TimelineType.EXPERIENCE && posts.length === 0 ? (
          <div>
            <Image src="/images/Empty_experience_post_illustration.svg" width={90} height={90} />
            <Typography style={{fontWeight: 'bold', fontSize: 18}}>
              No Experience posts yet
            </Typography>
            <Typography style={{fontWeight: 400, fontSize: 14}}>
              Create your own timeline experience and see only posts which interest you
            </Typography>
          </div>
        ) : timelineType === TimelineType.FRIEND && posts.length === 0 ? (
          <div>
            <Image src="/images/Empty_friend_post_illustration.svg" width={90} height={90} />
            <Typography style={{fontWeight: 'bold', fontSize: 18}}>
              No posts from friends yet
            </Typography>
            <Typography style={{fontWeight: 400, fontSize: 14}}>
              let’s make friends and you might get some valuable insights
            </Typography>
          </div>
        ) : (
          posts.map(post => (
            <PostDetail
              user={user}
              key={`post-${post.id}`}
              post={post}
              anonymous={anonymous}
              onUpvote={upvote}
              onSendTip={onSendTip}
              toggleDownvoting={toggleDownvoting}
              onOpenTipHistory={onOpenTipHistory}
              onDelete={onDelete}
              onReport={onReport}
              onShared={onShared}
              onRemoveVote={onRemoveVote}
            />
          ))
        )}
        {}
      </InfiniteScroll>
    </div>
  );
};
