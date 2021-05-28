import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import RedditReactionComponent from '../reactions/reddit.component';
import TwitterReactionComponent from '../reactions/twitter.component';

import clsx from 'clsx';
import ShowIf from 'src/components/common/show-if.component';
import { Post } from 'src/interfaces/post';
import { PostDetail } from 'src/lib/parse-social.util';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 14,
      width: '100%'
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    }
  })
);

type PostActionProps = {
  post: Post;
  detail: PostDetail;
  commentExpanded: boolean;
  expandComment: () => void;
  likePost: () => void;
  dislikePost: () => void;
};

export const PostActionComponent: React.FC<PostActionProps> = ({ post, detail, expandComment, commentExpanded, likePost, dislikePost }) => {
  const styles = useStyles();

  return (
    <>
      <ShowIf condition={post.platform === 'twitter'}>
        <TwitterReactionComponent metric={detail.metric} />
      </ShowIf>
      <ShowIf condition={post.platform === 'reddit'}>
        <RedditReactionComponent metric={detail.metric} />
      </ShowIf>

      <Button aria-label="like post" startIcon={<ThumbUpIcon />} onClick={likePost}>
        {
          //({post.publicMetric.liked})
        }
      </Button>
      <Button aria-label="dislike post" startIcon={<ThumbDownIcon />} onClick={dislikePost}>
        {
          //({post.publicMetric.disliked})
        }
      </Button>

      <IconButton
        className={clsx(styles.expand, {
          [styles.expandOpen]: commentExpanded
        })}
        onClick={expandComment}
        aria-expanded={commentExpanded}
        aria-label="show more">
        <CommentIcon />
      </IconButton>
      {
        //<Typography component="span">{post.publicMetric.comment} Comments</Typography>
      }
    </>
  );
};
