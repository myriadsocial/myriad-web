import React, {forwardRef} from 'react';

import {Grid, useMediaQuery} from '@material-ui/core';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {CommentAction} from './CommentAction';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const styles = useStyles({mobile: isMobile});

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

  const submitComment = () => {
    const editor = getEditorSelectors(editorId);

    const attributes = serialize(editor.value());

    onSubmit({
      ...attributes,
      referenceId,
      type,
    });

    if (editorRef?.children) {
      editorRef.children = initial;
    }
  };

  return (
    <Grid container className={styles.root} direction="row">
      <Avatar
        src={user?.profilePictureURL}
        name={user?.name}
        size={isMobile ? AvatarSize.TINY : AvatarSize.MEDIUM}
      />

      <div className={styles.editor} ref={ref}>
        <BasicEditor id={editorId} placeholder={placeholder} onSearchMention={onSearchMention}>
          <CommentAction expand={expand} onSubmit={submitComment} />
        </BasicEditor>
      </div>
    </Grid>
  );
};

export default forwardRef(CommentEditor);
