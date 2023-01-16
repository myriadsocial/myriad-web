import {PhotographIcon, TrashIcon} from '@heroicons/react/outline';
import {FilmIcon} from '@heroicons/react/outline';
import {PaperAirplaneIcon} from '@heroicons/react/outline';
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

import {ExclusiveContentPost} from 'src/interfaces/exclusive';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type CommentActionProps = {
  mobile?: boolean;
  expand: boolean;
  length?: number;
  onSubmit: () => void;
  exclusiveContent?: ExclusiveContentPost;
  handleRemoveExclusiveContent: () => void;
  handleOpenExclusiveContent: () => void;
  user: User;
};

export const CommentActionMobile: React.FC<CommentActionProps> = props => {
  const {
    expand,
    length,
    onSubmit,
    exclusiveContent,
    handleRemoveExclusiveContent,
    handleOpenExclusiveContent,
    user,
  } = props;

  const styles = useStyles({mobile: false});

  if (!expand && length === 0) return null;

  return (
    <div className={styles.mobile}>
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
        </ButtonGroup>
        <ButtonGroup color="primary">
          {!exclusiveContent ? (
            <>
              {user.fullAccess ? (
                <IconButton
                  onClick={handleOpenExclusiveContent}
                  disabled={length === 0}
                  className={styles.attachButton}>
                  <SvgIcon component={PaperClipIcon} viewBox="0 0 24 24" color="primary" />
                  <Typography component="span" color="primary" variant="body1">
                    {i18n.t('ExclusiveContent.Attach')}
                  </Typography>
                </IconButton>
              ) : (
                <Tooltip
                  title={<Typography>{i18n.t('ExclusiveContent.Text.Tooltip')}</Typography>}
                  aria-label="exclusive-content">
                  <IconButton aria-label="exclusive-content" onClick={null}>
                    <SvgIcon
                      component={PaperClipIcon}
                      viewBox="0 0 24 24"
                      className={styles.giftIconGray}
                    />
                    <Typography
                      component="span"
                      color={'#C2C2C2' as never}
                      variant="body1"
                      style={{lineHeight: 1.8}}>
                      {i18n.t('ExclusiveContent.Add')}
                    </Typography>
                  </IconButton>
                </Tooltip>
              )}
            </>
          ) : (
            <IconButton
              onClick={handleRemoveExclusiveContent}
              className={styles.attachButton}
              style={{color: '#f44336'}}>
              <SvgIcon component={TrashIcon} viewBox="0 0 24 24" />
              <Typography component="span" color="error" variant="body1">
                {i18n.t('ExclusiveContent.Remove')}
              </Typography>
            </IconButton>
          )}

          <IconButton aria-label="reply" onClick={onSubmit}>
            <SvgIcon
              className={length === 0 ? styles.disabled : styles.replyIcon}
              component={PaperAirplaneIcon}
              viewBox="0 0 24 24"
            />
          </IconButton>
        </ButtonGroup>
      </CardActions>
    </div>
  );
};

export default CommentActionMobile;
