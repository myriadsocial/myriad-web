import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import clsx from 'clsx';
import {PostMetric} from 'src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 14,
      width: '100%',
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    right: {
      marginLeft: 'auto',
    },
  }),
);

type PostActionProps = {
  metric: PostMetric;
  tippingEnabled: boolean;
  commentExpanded: boolean;
  liked?: boolean;
  disliked?: boolean;
  expandComment: () => void;
  likePost: () => void;
  dislikePost: () => void;
  sendTip: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const PostActionComponent: React.FC<PostActionProps> = ({
  metric,
  commentExpanded,
  tippingEnabled,
  liked = false,
  disliked = false,
  expandComment,
  likePost,
  dislikePost,
  sendTip,
}) => {
  const styles = useStyles();

  return (
    <>
      <Button
        aria-label="like post"
        color={liked ? 'primary' : 'default'}
        startIcon={<ThumbUpIcon />}
        onClick={likePost}>
        ({metric.likes})
      </Button>
      <Button
        aria-label="dislike post"
        color={disliked ? 'primary' : 'default'}
        startIcon={<ThumbDownIcon />}
        onClick={dislikePost}>
        ({metric.dislikes})
      </Button>

      <IconButton
        className={clsx(styles.expand, {
          [styles.expandOpen]: commentExpanded,
        })}
        onClick={expandComment}
        aria-expanded={commentExpanded}
        aria-label="post-comment">
        <CommentIcon />
      </IconButton>

      <Button
        className={styles.right}
        aria-label="tip-post-user"
        color="default"
        variant="contained"
        size="medium"
        disabled={!tippingEnabled}
        onClick={sendTip}>
        Send Tip
      </Button>
    </>
  );
};
