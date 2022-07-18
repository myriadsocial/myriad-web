import {PhotographIcon} from '@heroicons/react/outline';
import {FilmIcon} from '@heroicons/react/outline';
import {PaperAirplaneIcon} from '@heroicons/react/outline';

import React, {forwardRef} from 'react';

import {
  ButtonGroup,
  CardActions,
  Grid,
  IconButton,
  SvgIcon,
  Tooltip,
  useMediaQuery,
} from '@material-ui/core';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {useStyles} from './CommentEditor.style';
import {serialize} from './formatter';

import {BasicEditor, initial} from 'components/common/Editor';
import {getEditorSelectors, usePlateEditorRef} from 'components/common/Editor/store';
import {CommentProps} from 'src/interfaces/comment';
import {ReferenceType, SectionType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import theme from 'src/themes/light-theme';

export type CommentEditorProps = {
  referenceId: string;
  type: ReferenceType;
  section: SectionType;
  user?: User;
  expand?: boolean;
  placeholder?: string;
  onSearchMention: (query: string) => void;
  onSubmit: (comment: Partial<CommentProps>) => void;
};

const CommentEditor = (props: CommentEditorProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const styles = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const {
    referenceId,
    section,
    type,
    user,
    expand = false,
    placeholder = 'Write a Reply ...',
    onSearchMention,
    onSubmit,
  } = props;

  // each comment section get a different editor
  const editorId = `${referenceId}-${section}`;
  const editorRef = usePlateEditorRef(editorId);

  const isEmpty = (): boolean => {
    const editor = getEditorSelectors(editorId);

    return editor.value().length === 0;
  };

  const submitComment = () => {
    const editor = getEditorSelectors(editorId);

    const attributes = serialize(editor.value());

    onSubmit({
      ...attributes,
      referenceId,
      type,
    });

    editorRef.children = initial;
  };

  return (
    <Grid container className={styles.root} direction="row">
      <Avatar
        src={user?.profilePictureURL}
        name={user?.name}
        size={isMobile ? AvatarSize.TINY : AvatarSize.MEDIUM}
      />

      <div className={styles.editor} ref={ref}>
        <BasicEditor id={editorId} placeholder={placeholder} onSearchMention={onSearchMention} />

        {(expand || !isEmpty()) && (
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
            <IconButton aria-label="reply" onClick={submitComment} disabled={isEmpty()}>
              <SvgIcon
                className={isEmpty() ? styles.disabled : styles.replyIcon}
                component={PaperAirplaneIcon}
                viewBox="0 0 24 24"
              />
            </IconButton>
          </CardActions>
        )}
      </div>
    </Grid>
  );
};

export default forwardRef(CommentEditor);
