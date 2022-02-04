import {PhotographIcon} from '@heroicons/react/outline';
import {FilmIcon} from '@heroicons/react/outline';
import {PaperAirplaneIcon} from '@heroicons/react/outline';
import {
  Plate,
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createPlateComponents,
  createPlateOptions,
  createTrailingBlockPlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  ELEMENT_PARAGRAPH,
  withProps,
  TNode,
  createResetNodePlugin,
  ELEMENT_BLOCKQUOTE,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  useStoreEditorState,
  createNormalizeTypesPlugin,
} from '@udecode/plate';
import {ELEMENT_MENTION, MentionNodeData, useMentionPlugin} from '@udecode/plate-mention';

import React, {useMemo, useEffect, useState} from 'react';

import {ButtonGroup, CardActions, Grid, IconButton, SvgIcon, Tooltip} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import {useStyles} from './CommentEditor.style';
import {serialize} from './formatter';

import {EditableProps} from 'slate-react/dist/components/editable';
import {
  MentionElement,
  MentionSelect,
  renderMentionLabel,
} from 'src/components/PostEditor/Render/Mention';
import {createCharLimitPlugin} from 'src/components/PostEditor/plugins/charLimit';
import {acronym} from 'src/helpers/string';
import {CommentProps} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import theme from 'src/themes/light-theme';

export type PostEditorProps = {
  ref?: React.RefObject<HTMLDivElement>;
  referenceId: string;
  type?: ReferenceType;
  user?: User;
  expand?: boolean;
  debug?: boolean;
  placeholder?: string;
  mentionables: MentionNodeData[];
  onSearchMention: (query: string) => void;
  onSubmit: (comment: Partial<CommentProps>) => void;
};

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE],
  defaultType: ELEMENT_PARAGRAPH,
};

const MAX_CHARACTER_LIMIT = 180;

export const CommentEditor: React.FC<PostEditorProps> = props => {
  const styles = useStyles();
  const options = createPlateOptions();

  const {
    ref,
    referenceId,
    type,
    user,
    expand = false,
    debug = false,
    placeholder = 'Write a Reply ...',
    mentionables,
    onSearchMention,
    onSubmit,
  } = props;

  const editableProps: EditableProps = {
    placeholder,
    autoFocus: false,
    spellCheck: false,
    style: {
      padding: 16,
      background: '#FFFFFF',
      fontFamily: theme.typography.fontFamily,
      lineHeight: '24px',
      fontSize: 14,
    },
  };

  const components = createPlateComponents({
    [ELEMENT_MENTION]: withProps(MentionElement, {
      renderLabel: renderMentionLabel,
      prefix: '@',
    }),
  });

  const mentionPluginOptions = {
    mentionables,
    maxSuggestions: 10,
    insertSpaceAfterMention: true,
    trigger: '@',
    mentionableFilter: (s: string) => (mentionable: MentionNodeData) =>
      mentionable.name.toLowerCase().includes(s.toLowerCase()),
    mentionableSearchPattern: '\\S*',
  };

  const {
    getMentionSelectProps,
    plugin: mentionPlugin,
    searchValue: mentionQuery,
  } = useMentionPlugin(mentionPluginOptions);

  const plugins = useMemo(() => {
    const pluginsBasic = [
      // editor
      createReactPlugin(),
      createHistoryPlugin(),

      // elements
      createParagraphPlugin(),

      // others
      createTrailingBlockPlugin({type: ELEMENT_PARAGRAPH}),
      createSelectOnBackspacePlugin({
        allow: [ELEMENT_MENTION],
      }),
      createNormalizeTypesPlugin({
        rules: [{path: [0], strictType: ELEMENT_PARAGRAPH}],
      }),
      createSoftBreakPlugin({
        rules: [{hotkey: 'shift+enter'}],
      }),
      createResetNodePlugin({
        rules: [
          {
            ...resetBlockTypesCommonRule,
            hotkey: 'Enter',
            predicate: isBlockAboveEmpty,
          },
          {
            ...resetBlockTypesCommonRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtBlockStart,
          },
        ],
      }),
      createCharLimitPlugin({
        max: MAX_CHARACTER_LIMIT,
      }),
      mentionPlugin,
    ];

    return pluginsBasic;
  }, [mentionPlugin]);

  const editor = useStoreEditorState(referenceId);
  const [showMediaEmbed, setShowMediaEmbed] = useState(expand);
  const [comment, setComment] = useState<TNode[] | undefined>();

  useEffect(() => {
    if (mentionQuery.length > 0) {
      onSearchMention && onSearchMention(mentionQuery);
    }
  }, [mentionQuery]);

  const onChangeDebug = (value: TNode[]) => {
    if (debug) {
      console.log('[DEBUG]:', value);
    }

    setShowMediaEmbed(true);
    setComment(value);
  };

  const isEmpty = () => {
    if (comment && comment[0].children.length > 1) return false;
    else if (comment && comment[0].children[0].text) return false;
    else return true;
  };

  const submitComment = () => {
    if (comment) {
      const attributes = serialize(comment);

      onSubmit({
        ...attributes,
        referenceId,
        type,
      });

      setComment(undefined);
    }
    setShowMediaEmbed(false);
  };

  return (
    <Grid container className={styles.root} direction="row">
      <Avatar className={styles.avatar} src={user?.profilePictureURL}>
        {acronym(user?.name || '')}
      </Avatar>

      <div className={styles.editor} ref={ref}>
        <Plate
          id={referenceId}
          initialValue={comment}
          editor={editor}
          editableProps={editableProps}
          onChange={onChangeDebug}
          plugins={plugins}
          components={components}
          options={options}>
          <MentionSelect {...getMentionSelectProps()} renderLabel={renderMentionLabel} />

          {showMediaEmbed && (
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
        </Plate>
      </div>
    </Grid>
  );
};
