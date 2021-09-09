import {ShareIcon} from '@heroicons/react/outline';
import {action} from '@storybook/addon-actions';

import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

import {VotingComponent} from '../Voting';
import {useStyles} from './postAction.style';

type PostActionProps = {
  metrics: {
    share: number;
    comments: number;
    vote: number;
  };
  onUpvote: () => void;
  onDownVote: () => void;
};

export const PostActionComponent: React.FC<PostActionProps> = props => {
  const styles = useStyles();

  const {
    metrics: {share, comments, vote},
    onUpvote,
    onDownVote,
  } = props;

  return (
    <div className={styles.root}>
      <VotingComponent variant="row" vote={vote} onUpvote={onUpvote} onDownVote={onDownVote} />

      <div className={styles.section}>
        <IconButton onClick={action('comment')} className={styles.action} color="primary">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography component="span" color="textPrimary" variant="caption">
          {comments} Comments
        </Typography>
      </div>

      <div className={styles.section}>
        <IconButton onClick={action('share')} className={styles.action} color="primary">
          <SvgIcon component={ShareIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography component="span" color="textPrimary" variant="caption">
          {share} Shares
        </Typography>
      </div>
    </div>
  );
};
