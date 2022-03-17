import {ChatAltIcon, DuplicateIcon, ShareIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {TextField, Typography, InputAdornment} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {PostMetric} from '../../../interfaces/post';
import {Modal} from '../Modal';
import {VotingComponent} from '../Voting';
import {useStyles} from './postAction.style';

import millify from 'millify';
import ShowIf from 'src/components/common/show-if.component';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';

type PostActionProps = {
  metrics: PostMetric;
  downvoted?: boolean;
  postUrl: string;
  embedUrl: string;
  upvoted?: boolean;
  onUpvote: () => void;
  onDownVote: () => void;
  onShowComments: () => void;
  onShared: () => void;
  disableAction?: boolean;
};

export const PostActionComponent: React.FC<PostActionProps> = props => {
  const style = useStyles();

  const {
    metrics: {discussions = 0, debates = 0, upvotes = 0, downvotes = 0},
    downvoted = false,
    upvoted = false,
    postUrl,
    embedUrl,
    onUpvote,
    onDownVote,
    onShowComments,
    onShared,
    disableAction,
  } = props;

  const {openToasterSnack} = useToasterSnackHook();

  const [linkAnchorEl, setLinkAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickShareLink = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLinkAnchorEl(event.currentTarget);
  };

  const handleLinkCopied = () => {
    setLinkAnchorEl(null);
    openToasterSnack({
      message: 'Link copied!',
      variant: 'success',
    });
    onShared();
  };

  const handleCloseCopyLink = () => {
    setLinkAnchorEl(null);
  };

  const formatNumber = (num: number) => {
    const vote = millify(num, {
      precision: 1,
      lowercase: true,
    });
    return vote;
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
        <IconButton
          disabled={disableAction}
          onClick={onShowComments}
          className={style.action}
          color="primary">
          <SvgIcon classes={{root: style.fill}} component={ChatAltIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography component="span" color="primary" variant="body1" className={style.wording}>
          {formatNumber(discussions + debates)}&nbsp;Comments
        </Typography>
      </div>

      <ShowIf condition={!disableAction}>
        <div className={style.section}>
          <IconButton onClick={handleClickShareLink} className={style.action} color="primary">
            <SvgIcon
              className={style.mr1}
              classes={{root: style.fill}}
              component={ShareIcon}
              viewBox="0 0 24 24"
            />
            <Typography component="span" color="primary" variant="body1" className={style.wording}>
              Share
            </Typography>
          </IconButton>
        </div>

        <Modal
          align="left"
          title="Copy post link"
          className={style.modal}
          open={Boolean(linkAnchorEl)}
          onClose={handleCloseCopyLink}>
          <div className={style.copy}>
            <Typography component="p" className={style.subtitle} color="primary" variant="h4">
              Post URL
            </Typography>
            <TextField
              label="Post URL"
              id="copy-post-url"
              value={postUrl}
              variant="outlined"
              disabled
              fullWidth
              margin="none"
              className={style.input}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CopyToClipboard text={postUrl} onCopy={handleLinkCopied}>
                      <IconButton aria-label="copy-post-link" style={{padding: 0}}>
                        <SvgIcon component={DuplicateIcon} color="primary" />
                      </IconButton>
                    </CopyToClipboard>
                  </InputAdornment>
                ),
              }}
            />
            <div className={style.divider} />
            <Typography component="p" className={style.subtitle} color="primary" variant="h4">
              Embed Link
            </Typography>
            <TextField
              label="Copy and paste this code into your website or blog"
              id="copy-post-embed"
              value={`<iframe width="700" height="525" src="${embedUrl}></iframe>`}
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
                      text={`<iframe src="${embedUrl}"></iframe>`}
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
      </ShowIf>
    </div>
  );
};
