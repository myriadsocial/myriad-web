import {ChatAltIcon, DuplicateIcon, ShareIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {Menu, MenuItem, TextField, Typography, InputAdornment} from '@material-ui/core';
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
    metrics: {discussions = 0, debates = 0, upvotes = 0, downvotes},
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
          {discussions + debates} Comments
        </Typography>
      </div>

      <div className={style.section}>
        <IconButton onClick={handleClickShare} className={style.action} color="primary">
          <SvgIcon
            className={style.mr1}
            classes={{root: style.fill}}
            component={ShareIcon}
            viewBox="0 0 24 24"
          />
          <Typography component="span" color="textPrimary" variant="caption">
            Share
          </Typography>
        </IconButton>
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
          <Typography component="p" className={style.subtitle} color="primary" variant="caption">
            Post URL
          </Typography>
          <TextField
            label="Post URL"
            id="copy-post-url"
            value={shareUrl}
            variant="outlined"
            disabled
            fullWidth
            margin="none"
            className={style.input}
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
          <div className={style.divider} />
          <Typography component="p" className={style.subtitle} color="primary" variant="caption">
            Embed Link
          </Typography>
          <TextField
            label="Copy and paste this code into your website or blog"
            id="copy-post-embed"
            value={`<iframe src="${shareUrl}></iframe>`}
            variant="outlined"
            disabled
            fullWidth
            multiline
            margin="none"
            className={style.multiline}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CopyToClipboard
                    text={`<iframe src="${shareUrl}"></iframe>`}
                    onCopy={handleLinkCopied}>
                    <IconButton aria-label="copy-post-embed" style={{padding: 0}}>
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
