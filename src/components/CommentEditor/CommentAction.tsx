import {PhotographIcon, TrashIcon} from '@heroicons/react/outline';
import {FilmIcon} from '@heroicons/react/outline';
import {PaperAirplaneIcon} from '@heroicons/react/outline';
import {EmojiHappyIcon} from '@heroicons/react/outline';
import {PaperClipIcon} from '@heroicons/react/outline';

import React from 'react';

import {
  ButtonGroup,
  CardActions,
  IconButton,
  SvgIcon,
  Tooltip,
  Typography,
} from '@material-ui/core';

import {useStyles} from './CommentEditor.style';

import {useEditorState} from 'components/common/Editor';
import {EmojiPickerToolbarButton} from 'components/common/Editor/render/Toolbar/Button';
import {formatToString} from 'components/common/NodeViewer/formatter';
import ShowIf from 'components/common/show-if.component';
import {ExclusiveContentPost} from 'src/interfaces/exclusive';
import i18n from 'src/locale';

type CommentActionProps = {
  mobile?: boolean;
  expand: boolean;
  onSubmit: () => void;
  exclusiveContent?: ExclusiveContentPost;
  handleRemoveExclusiveContent: () => void;
  handleOpenExclusiveContent: () => void;
};

export const CommentAction: React.FC<CommentActionProps> = props => {
  const {
    expand,
    mobile,
    onSubmit,
    exclusiveContent,
    handleRemoveExclusiveContent,
    handleOpenExclusiveContent,
  } = props;

  const styles = useStyles({mobile: false});
  const editor = useEditorState();

  const length = editor.children.map(element => formatToString(element)).join(' ').length;

  if (!expand && length === 0) return null;

  return (
    <>
      <CardActions disableSpacing className={styles.action}>
        <ButtonGroup color="primary">
          <Tooltip title="Coming soon" arrow>
            <IconButton aria-label="photo">
              <SvgIcon component={PhotographIcon} color="primary" viewBox="0 0 24 24" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Coming soon" arrow>
            <IconButton aria-label="video">
              <SvgIcon color="primary" component={FilmIcon} viewBox="0 0 24 24" />
            </IconButton>
          </Tooltip>
          <ShowIf condition={!mobile}>
            <IconButton aria-label="emoji">
              <EmojiPickerToolbarButton
                icon={<SvgIcon color="primary" component={EmojiHappyIcon} viewBox="0 0 24 24" />}
              />
            </IconButton>
          </ShowIf>
        </ButtonGroup>
        <ButtonGroup color="primary">
          {!exclusiveContent ? (
            <IconButton
              onClick={handleOpenExclusiveContent}
              disabled={length === 0}
              className={styles.attachButton}>
              <SvgIcon component={PaperClipIcon} viewBox="0 0 24 24" />
              <Typography component="span" color="primary" variant="body1">
                {i18n.t('ExclusiveContent.Attach')}
              </Typography>
            </IconButton>
          ) : (
            <IconButton
              onClick={handleRemoveExclusiveContent}
              disabled={length === 0}
              className={styles.attachButton}
              style={{color: '#f44336'}}>
              <SvgIcon component={TrashIcon} viewBox="0 0 24 24" />
              <Typography component="span" color="error" variant="body1">
                {i18n.t('ExclusiveContent.Remove')}
              </Typography>
            </IconButton>
          )}

          <IconButton aria-label="reply" onClick={onSubmit} disabled={length === 0}>
            <SvgIcon
              className={length === 0 ? styles.disabled : styles.replyIcon}
              component={PaperAirplaneIcon}
              viewBox="0 0 24 24"
            />
          </IconButton>
        </ButtonGroup>
      </CardActions>
    </>
  );
};
