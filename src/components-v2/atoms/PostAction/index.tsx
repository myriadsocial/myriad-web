import {ChatAltIcon, DuplicateIcon, ShareIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {InputAdornment, Menu, MenuItem, TextField, Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {PostMetric} from '../../../interfaces/post';
import {Modal} from '../Modal';
import {Status, Toaster} from '../Toaster';
import {VotingComponent} from '../Voting';
import {useStyles} from './postAction.style';

type PostActionProps = {
  metrics: PostMetric;
  downvoted?: boolean;
  shareUrl: string;
  upvoted?: boolean;
  onUpvote: () => void;
  onDownVote: () => void;
  onShowComments: () => void;
  onShared: () => void;
};

export const PostActionComponent: React.FC<PostActionProps> = props => {
  const style = useStyles();

  const {
    metrics: {shares = 0, comments, upvotes = 0, downvotes},
    downvoted = false,
    upvoted = false,
    shareUrl,
    onUpvote,
    onDownVote,
    onShowComments,
    onShared,
  } = props;

  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [linkAnchorEl, setLinkAnchorEl] = useState<null | HTMLElement>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleClickShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleCloseShare = () => {
    setShareAnchorEl(null);
  };

  const handleClickShareLink = (event: React.MouseEvent<HTMLLIElement>) => {
    setLinkAnchorEl(event.currentTarget);
  };

  const handleLinkCopied = () => {
    setShareAnchorEl(null);
    setLinkAnchorEl(null);
    setLinkCopied(true);

    onShared();
  };

  const handleCloseCopyLink = () => {
    setShareAnchorEl(null);
    setLinkAnchorEl(null);
    setLinkCopied(false);
  };

  const handleCloseLinkCopied = () => {
    setLinkCopied(false);
  };

  return (
    <div className={style.root}>
      <VotingComponent
        isDownVote={downvoted}
        isUpVote={upvoted}
        variant="row"
        vote={upvotes - downvotes}
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
          <MenuItem button onClick={handleClickShareLink}>
            <div style={{width: 170}}>
              <Typography>Copy Link</Typography>
            </div>
          </MenuItem>
        </Menu>
      </div>

      <Modal
        align="left"
        title="Copy post link"
        className={style.modal}
        open={Boolean(linkAnchorEl)}
        onClose={handleCloseCopyLink}>
        <div className={style.copy}>
          <TextField
            label="Post URL"
            id="copy-post-url"
            value={shareUrl}
            variant="outlined"
            disabled
            fullWidth
            margin="none"
            style={{marginBottom: 0}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CopyToClipboard text={shareUrl} onCopy={handleLinkCopied}>
                    <IconButton aria-label="copy-post-link" style={{padding: 0}}>
                      <SvgIcon component={DuplicateIcon} color="primary" />
                    </IconButton>
                  </CopyToClipboard>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Modal>

      <Toaster
        open={linkCopied}
        onClose={handleCloseLinkCopied}
        toasterStatus={Status.SUCCESS}
        message="Link copied!"
      />
    </div>
  );
};
