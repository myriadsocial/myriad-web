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
import {ELEMENT_MENTION, MentionNodeData, useMentionPlugin} from '@udecode/plate-mention';
import {HeadingToolbar} from '@udecode/plate-toolbar';

import React, {useMemo, useEffect, useState} from 'react';

import Box from '@material-ui/core/Box';
import {Image} from '@material-ui/icons';

import {Upload} from '../Upload';
import {Modal} from '../atoms/Modal';
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
  onFileUploaded?: (file: File) => Promise<string>;
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
    onFileUploaded,
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

  const [setImageUrl, setImageUrlPromise] = useState<any>();
  const [showImageUpload, toggleImageUpload] = useState(false);

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

  const closeImageUpload = () => {
    toggleImageUpload(prevState => !prevState);
  };

  const getImageUrl = async (): Promise<string> => {
    let resolve;

    toggleImageUpload(prevState => !prevState);

    const promise = new Promise<string>(_resolve => {
      resolve = _resolve;
    });

    /* @ts-expect-error */
    promise.resolve = resolve;

    setImageUrlPromise(promise);

    return promise;
  };

  const handleImageSelected = async (result: File[] | string) => {
    if (typeof result === 'string') {
      setImageUrl.resolve(result);
    }

    if (Array.isArray(result) && onFileUploaded) {
      const url = await onFileUploaded(result[0]);

      setImageUrl.resolve(url);
    }

    toggleImageUpload(prevState => !prevState);
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
          <ToolbarElementList />
          <ToolbarButtonsMarks />
          <ToolbarButtonsAlign />
          <ToolbarButtonsList />
          <ToolbarImage icon={<Image />} getImageUrl={getImageUrl} />
        </HeadingToolbar>

        <MentionSelect {...getMentionSelectProps()} renderLabel={renderMentionLabel} />
      </Plate>

      <Modal title="Upload file" maxWidth="xl" open={showImageUpload} onClose={closeImageUpload}>
        <Upload title="Image" onFileSelected={handleImageSelected} accept={['image/*']} />
      </Modal>

      <Modal title="Upload file" maxWidth="xl" open={showImageUpload} onClose={closeImageUpload}>
        <Upload title="Video" onFileSelected={handleImageSelected} accept={['video/*']} />
      </Modal>
    </Box>
  );
};
