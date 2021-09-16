import {ShareIcon} from '@heroicons/react/outline';
import {ChatAltIcon} from '@heroicons/react/outline';
import {action} from '@storybook/addon-actions';

import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import ChatBubbleOutlineIcon from '../../../images/Icons/ChatBubbleOutlineIcon.svg';
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
  const style = useStyles();

  const {
    metrics: {share, comments, vote},
    onUpvote,
    onDownVote,
  } = props;

  return (
    <div className={style.root}>
      <VotingComponent
        isDownVote={false}
        isUpVote={true}
        variant="row"
        vote={vote}
        onUpvote={onUpvote}
        onDownVote={onDownVote}
      />

      <div className={style.section}>
        <IconButton onClick={action('comment')} className={style.action} color="primary">
          <SvgIcon classes={{root: style.fill}} component={ChatAltIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography component="span" color="textPrimary" variant="caption">
          {comments} Comments
        </Typography>
      </div>

      <div className={style.section}>
        <IconButton onClick={action('share')} className={style.action} color="primary">
          <SvgIcon classes={{root: style.fill}} component={ShareIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography component="span" color="textPrimary" variant="caption">
          {share} Shares
        </Typography>
      </div>
    </div>
  );
};
