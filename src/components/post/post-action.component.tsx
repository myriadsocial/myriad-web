import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import {usePostActionHook} from './post-action.hook';

import clsx from 'clsx';
import {Post} from 'src/interfaces/post';

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
  post: Post;
  commentExpanded: boolean;
  expandComment: () => void;
  likePost: () => void;
  dislikePost: () => void;
  tipOwner: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const PostActionComponent: React.FC<PostActionProps> = ({
  post,
  expandComment,
  commentExpanded,
  likePost,
  dislikePost,
  tipOwner,
}) => {
  const styles = useStyles();

  const {tippingEnabled} = usePostActionHook(post);

  return (
    <>
      <Button aria-label="like post" startIcon={<ThumbUpIcon />} onClick={likePost}>
        ({post.publicMetric?.liked || 0})
      </Button>
      <Button aria-label="dislike post" startIcon={<ThumbDownIcon />} onClick={dislikePost}>
        ({post.publicMetric?.disliked || 0})
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
        onClick={tipOwner}>
        Send Tip
      </Button>
    </>
  );
};
