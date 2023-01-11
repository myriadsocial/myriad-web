import React, {forwardRef, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import getConfig from 'next/config';
import dynamic from 'next/dynamic';

import {Grid, useMediaQuery} from '@material-ui/core';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {useStyles} from './CommentEditor.style';
import {serialize} from './formatter';

import ExclusiveCreateContainer from 'components/ExclusiveContentCreate/ExclusiveCreate.container';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {initial} from 'components/common/Editor';
import {getEditorSelectors, usePlateEditorRef} from 'components/common/Editor/store';
import {CommentProps} from 'src/interfaces/comment';
import {ExclusiveContentPost} from 'src/interfaces/exclusive';
import {ReferenceType, SectionType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {createExclusiveContent} from 'src/reducers/timeline/actions';
import theme from 'src/themes/light-theme';

const CKEditor = dynamic(() => import('../common/CKEditor/BasicEditor'), {
  ssr: false,
});
const PlateEditor = dynamic(() => import('../common/Editor/BasicEditor'), {
  ssr: false,
});
const CommentAction = dynamic(() => import('./CommentAction'), {
  ssr: false,
});
const CommentActionMobile = dynamic(() => import('./CommentActionMobile'), {
  ssr: false,
});

export type CommentEditorProps = {
  referenceId: string;
  type: ReferenceType;
  section: SectionType;
  user?: User;
  expand?: boolean;
  placeholder?: string;
  asset?: {
    exclusiveContents?: [string];
  };
  onSearchMention: (query: string) => void;
  onSubmit: (comment: Partial<CommentProps>) => void;
};

const CommentEditor = (props: CommentEditorProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const dispatch = useDispatch();
  const {publicRuntimeConfig} = getConfig();
  const confirm = useConfirm();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const Editor = isMobile ? CKEditor : PlateEditor;
  const Action = isMobile ? CommentActionMobile : CommentAction;

  const styles = useStyles({mobile: isMobile});

  const [openExclusiveContent, setOpenExclusiveContent] = useState(false);
  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContentPost | null>(null);
  const handleOpenExclusiveContent = () => {
    setOpenExclusiveContent(!openExclusiveContent);
  };
  const handleSubmitExclusiveContent = (content: ExclusiveContentPost) => {
    setExclusiveContent(content);
    handleOpenExclusiveContent();
  };

  const handleRemoveExclusiveContent = () => {
    setExclusiveContent(null);
  };

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
  const ckEditorRef = useRef<any>();
  const [content, setContent] = useState<string>('');

  const submitComment = () => {
    const comment: Partial<CommentProps> = {
      referenceId,
      type,
    };
    handleRemoveExclusiveContent();

    if (exclusiveContent) {
      dispatch(
        createExclusiveContent(
          exclusiveContent,
          [],
          resp => {
            comment.asset = {
              exclusiveContents: [
                `${publicRuntimeConfig.myriadAPIURL}/user/unlockable-contents/${resp?.id}`,
              ],
            };

            if (isMobile) {
              comment.text = content;
              comment.mentions = [];
            } else {
              const editor = getEditorSelectors(editorId);
              const attributes = serialize(editor.value());

              comment.text = attributes.text;
              comment.mentions = attributes.mentions;
            }

            onSubmit(comment);
          },
          () => {
            confirm({
              title: i18n.t('LiteVersion.LimitTitlePost', {count: 0}),
              description: i18n.t('LiteVersion.LimitDescPost'),
              icon: 'warning',
              confirmationText: i18n.t('General.Got_It'),
              cancellationText: i18n.t('LiteVersion.MaybeLater'),
              onConfirm: () => {
                undefined;
              },
              onCancel: () => {
                undefined;
              },
              hideCancel: true,
            });
          },
        ),
      );
    } else {
      if (isMobile) {
        comment.text = content;
        comment.mentions = [];
      } else {
        const editor = getEditorSelectors(editorId);
        const attributes = serialize(editor.value());

        comment.text = attributes.text;
        comment.mentions = attributes.mentions;
      }

      onSubmit(comment);
    }

    if (editorRef?.children) {
      editorRef.children = initial;
    }

    if (ckEditorRef.current) {
      setContent('');
      ckEditorRef.current.setData('');
    }
  };

  const handleEditorReady = editor => {
    ckEditorRef.current = editor;
  };

  const handleContentChange = data => {
    setContent(data);
  };

  return (
    <>
      <Grid container className={styles.root} direction="row">
        <Avatar
          src={user?.profilePictureURL}
          name={user?.name}
          size={isMobile ? AvatarSize.TINY : AvatarSize.MEDIUM}
        />

        <div className={styles.editor} ref={ref}>
          <Editor
            id={editorId}
            placeholder={placeholder}
            onSearchMention={onSearchMention}
            onReady={handleEditorReady}
            onChange={handleContentChange}>
            <Action
              expand={expand}
              mobile={isMobile}
              length={content.length}
              onSubmit={submitComment}
              exclusiveContent={exclusiveContent}
              handleOpenExclusiveContent={handleOpenExclusiveContent}
              handleRemoveExclusiveContent={handleRemoveExclusiveContent}
            />
          </Editor>
        </div>
      </Grid>

      <ExclusiveCreateContainer
        open={openExclusiveContent}
        onClose={handleOpenExclusiveContent}
        onSubmit={handleSubmitExclusiveContent}
      />
    </>
  );
};

export default forwardRef(CommentEditor);
