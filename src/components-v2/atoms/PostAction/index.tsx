import {ShareIcon} from '@heroicons/react/outline';
import {ChatAltIcon} from '@heroicons/react/outline';

import React from 'react';

import {Menu, MenuItem, Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {PostMetric} from '../../../interfaces/post';
import {VotingComponent} from '../Voting';
import {useStyles} from './postAction.style';

type PostActionProps = {
  metrics: PostMetric;
  downvoted?: boolean;
  upvoted?: boolean;
  onUpvote: () => void;
  onDownVote: () => void;
  onShowComments: () => void;
};

export const PostActionComponent: React.FC<PostActionProps> = props => {
  const style = useStyles();

  const {
    metrics: {shares = 0, comments, upvotes = 0},
    downvoted = false,
    upvoted = false,
    onUpvote,
    onDownVote,
    onShowComments,
  } = props;

  const [shareAnchorEl, setShareAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClickShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleCloseShare = () => {
    setShareAnchorEl(null);
  };

  const handleOnShare = (type: string) => () => {
    console.log('type', type);
  };

  return (
    <div className={style.root}>
      <VotingComponent
        isDownVote={downvoted}
        isUpVote={upvoted}
        variant="row"
        vote={upvotes}
        onUpvote={onUpvote}
        onDownVote={onDownVote}
      />

      <div className={style.section}>
        <IconButton onClick={onShowComments} className={style.action} color="primary">
          <SvgIcon classes={{root: style.fill}} component={ChatAltIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography component="span" color="textPrimary" variant="caption">
          {comments} Comments
        </Typography>
      </div>

      <div className={style.section}>
        <IconButton onClick={handleClickShare} className={style.action} color="primary">
          <SvgIcon classes={{root: style.fill}} component={ShareIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography component="span" color="textPrimary" variant="caption">
          {shares} Shares
        </Typography>
        <Menu
          id="share-menu"
          anchorEl={shareAnchorEl}
          keepMounted
          open={Boolean(shareAnchorEl)}
          onClose={handleCloseShare}>
          <MenuItem onClick={handleOnShare('quick')}>Quick Share</MenuItem>
          <MenuItem onClick={handleOnShare('quote')}>Quote Share</MenuItem>
          <MenuItem onClick={handleOnShare('link')}>Link</MenuItem>
        </Menu>
      </div>
    </div>
  );
};
