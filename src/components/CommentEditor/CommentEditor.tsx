import React, {forwardRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {Grid, useMediaQuery} from '@material-ui/core';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {CommentAction} from './CommentAction';
import {useStyles} from './CommentEditor.style';
import {serialize} from './formatter';

import ExclusiveCreateContainer from 'components/ExclusiveContentCreate/ExclusiveCreate.container';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {BasicEditor, initial} from 'components/common/Editor';
import {getEditorSelectors, usePlateEditorRef} from 'components/common/Editor/store';
import {CommentProps} from 'src/interfaces/comment';
import {ExclusiveContentPost} from 'src/interfaces/exclusive';
import {ReferenceType, SectionType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {createExclusiveContent} from 'src/reducers/timeline/actions';
import theme from 'src/themes/light-theme';

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
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

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

  const submitComment = () => {
    const editor = getEditorSelectors(editorId);

    const attributes = serialize(editor.value());

    if (exclusiveContent) {
      dispatch(
        createExclusiveContent(
          exclusiveContent,
          [],
          resp => {
            onSubmit({
              ...attributes,
              referenceId,
              type,
              asset: {
                exclusiveContents: [
                  `${publicRuntimeConfig.myriadAPIURL}/user/unlockable-contents/${resp?.id}`,
                ],
              },
            });
          },
          () => {
            confirm({
              title: i18n.t('LiteVersion.LimitTitlePost', {count: 0}),
              description: i18n.t('LiteVersion.LimitDescPost'),
              icon: 'warning',
              confirmationText: i18n.t('LiteVersion.ConnectWallet'),
              cancellationText: i18n.t('LiteVersion.MaybeLater'),
              onConfirm: () => {
                router.push({pathname: '/wallet', query: {type: 'manage'}});
              },
              onCancel: () => {
                undefined;
              },
            });
          },
        ),
      );
    } else {
      onSubmit({
        ...attributes,
        referenceId,
        type,
      });
    }

    if (editorRef?.children) {
      editorRef.children = initial;
    }
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
          <BasicEditor id={editorId} placeholder={placeholder} onSearchMention={onSearchMention}>
            <CommentAction
              expand={expand}
              mobile={isMobile}
              onSubmit={submitComment}
              exclusiveContent={exclusiveContent}
              handleOpenExclusiveContent={handleOpenExclusiveContent}
              handleRemoveExclusiveContent={handleRemoveExclusiveContent}
            />
          </BasicEditor>
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
