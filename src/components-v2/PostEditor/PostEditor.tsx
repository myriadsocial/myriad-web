import {
  Plate,
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createBlockquotePlugin,
  createHeadingPlugin,
  createListPlugin,
  createPlateComponents,
  createPlateOptions,
  createAlignPlugin,
  createTrailingBlockPlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createExitBreakPlugin,
  createMediaEmbedPlugin,
  ELEMENT_PARAGRAPH,
  ELEMENT_MEDIA_EMBED,
  withProps,
  TNode,
} from '@udecode/plate';
import {ELEMENT_IMAGE, createImagePlugin} from '@udecode/plate-image';
import {ToolbarImage} from '@udecode/plate-image-ui';
import {createLinkPlugin} from '@udecode/plate-link';
import {ToolbarLink} from '@udecode/plate-link-ui';
import {ELEMENT_MENTION, MentionNodeData, useMentionPlugin} from '@udecode/plate-mention';
import {HeadingToolbar} from '@udecode/plate-toolbar';

import React, {useMemo, useEffect} from 'react';

import Box from '@material-ui/core/Box';
import {Image, Link} from '@material-ui/icons';

import {useStyles} from './PostEditor.styles';
import {HashtagElement} from './Render/Hashtag';
import {MentionElement, MentionSelect, renderMentionLabel} from './Render/Mention';
import {ToolbarButtonsAlign} from './Toolbar/ToolbarAlign';
import {ToolbarElementList} from './Toolbar/ToolbarElement';
import {ToolbarButtonsList} from './Toolbar/ToolbarList';
import {ToolbarButtonsMarks, plugins as markPlugins} from './Toolbar/ToolbarMark';
import {createHashtagPlugin, ELEMENT_HASHTAG} from './plugins/hashtag';

export type PostEditorProps = {
  value: TNode[];
  debug?: boolean;
  placeholder?: string;
  mentionable: MentionNodeData[];
  onSearchMention: (query: string) => void;
  onChange?: (value: TNode[]) => void;
};

export const PostEditor: React.FC<PostEditorProps> = props => {
  const styles = useStyles();
  const options = createPlateOptions();

  const {
    debug = false,
    placeholder = 'Type…',
    mentionable,
    value,
    onSearchMention,
    onChange,
  } = props;

  const editableProps = {
    placeholder,
    style: {
      padding: 20,
      background: '#FFFFFF',
    },
  };

  const components = createPlateComponents({
    [ELEMENT_MENTION]: withProps(MentionElement, {
      renderLabel: renderMentionLabel,
      prefix: '@',
    }),
    [ELEMENT_HASHTAG]: withProps(HashtagElement, {
      prefix: '#',
    }),
  });

  const mentionPluginOptions = {
    mentionables: mentionable,
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
      createBlockquotePlugin(),
      createHeadingPlugin(),

      // marks
      ...markPlugins,

      createAlignPlugin(),

      // list
      createListPlugin(),

      // media
      createImagePlugin(),
      createLinkPlugin(),
      createMediaEmbedPlugin(),

      // others
      createTrailingBlockPlugin({type: ELEMENT_PARAGRAPH}),
      createSelectOnBackspacePlugin({allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED]}),
      createSoftBreakPlugin(),
      createExitBreakPlugin(),

      createHashtagPlugin(),
      mentionPlugin,
    ];

    return pluginsBasic;
  }, [mentionPlugin]);

  useEffect(() => {
    if (mentionQuery.length > 0) {
      onSearchMention && onSearchMention(mentionQuery);
    }
  }, [mentionQuery]);

  const onChangeDebug = (value: TNode[]) => {
    if (debug) {
      console.log('[DEBUG]:', value);
    }

    onChange && onChange(value);
  };

  return (
    <Box className={styles.root}>
      <Plate
        editableProps={editableProps}
        initialValue={value}
        onChange={onChangeDebug}
        plugins={plugins}
        components={components}
        options={options}>
        <HeadingToolbar className={styles.header}>
          <ToolbarButtonsMarks />
          <ToolbarElementList />
          <ToolbarButtonsAlign />
          <ToolbarButtonsList />
          <ToolbarLink icon={<Link />} />
          <ToolbarImage icon={<Image />} />
        </HeadingToolbar>

        <MentionSelect {...getMentionSelectProps()} renderLabel={renderMentionLabel} />
      </Plate>
    </Box>
  );
};
