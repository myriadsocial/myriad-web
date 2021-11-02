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
  useStoreEditorState,
  TNode,
  getPlatePluginType,
  LinkElement,
  ImageElement,
  ELEMENT_BLOCKQUOTE,
} from '@udecode/plate';
import {insertNodes, isCollapsed, unwrapNodes} from '@udecode/plate-common';
import {ELEMENT_IMAGE, createImagePlugin, insertImage} from '@udecode/plate-image';
import {createLinkPlugin, ELEMENT_LINK, upsertLinkAtSelection} from '@udecode/plate-link';
import {ToolbarLink} from '@udecode/plate-link-ui';
import {ELEMENT_MENTION, MentionNodeData, useMentionPlugin} from '@udecode/plate-mention';
import {HeadingToolbar} from '@udecode/plate-toolbar';

import React, {useMemo, useEffect, useState} from 'react';

import Box from '@material-ui/core/Box';
import {Link} from '@material-ui/icons';

import theme from '../../themes/light-theme-v2';
import {EmbedURL} from '../EmbedURL';
import {Upload} from '../Upload';
import {Modal} from '../atoms/Modal';
import {useStyles} from './PostEditor.styles';
import {HashtagElement} from './Render/Hashtag';
import {MediaEmbedElement} from './Render/MediaEmbed';
import {MentionElement, MentionSelect, renderMentionLabel} from './Render/Mention';
import {ToolbarButtonsAlign} from './Toolbar/ToolbarAlign';
import {ToolbarElementList} from './Toolbar/ToolbarElement';
import {ToolbarButtonsList} from './Toolbar/ToolbarList';
import {ToolbarButtonsMarks, plugins as markPlugins} from './Toolbar/ToolbarMark';
import {ToolbarMedia} from './Toolbar/ToolbarMedia';
import {createHashtagPlugin, ELEMENT_HASHTAG} from './plugins/hashtag';

import {Transforms, Selection, Editor} from 'slate';
import {ReactEditor} from 'slate-react';
import {EditableProps} from 'slate-react/dist/components/editable';

export type PostEditorProps = {
  debug?: boolean;
  placeholder?: string;
  mentionable: MentionNodeData[];
  uploadProgress: number;
  onSearchMention: (query: string) => void;
  onChange?: (value: TNode[]) => void;
  onFileUploaded?: (file: File, type: 'image' | 'video') => Promise<string | null>;
};

export const PostEditor: React.FC<PostEditorProps> = props => {
  const styles = useStyles();
  const options = createPlateOptions();

  const {
    debug = false,
    placeholder = 'Type…',
    mentionable,
    uploadProgress,
    onSearchMention,
    onChange,
    onFileUploaded,
  } = props;

  const editableProps: EditableProps = {
    placeholder,
    autoFocus: true,
    spellCheck: false,
    style: {
      padding: 20,
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
    [ELEMENT_HASHTAG]: withProps(HashtagElement, {
      prefix: '#',
    }),
    [ELEMENT_IMAGE]: withProps(ImageElement, {
      caption: {disabled: true},
      draggable: false,
    }),
    [ELEMENT_MEDIA_EMBED]: withProps(MediaEmbedElement, {}),
    [ELEMENT_LINK]: withProps(LinkElement, {
      styles: {
        root: {
          color: `${theme.palette.primary.main}!important`,
          fontWeight: 700,
        },
      },
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
      createSelectOnBackspacePlugin({
        allow: [ELEMENT_MENTION, ELEMENT_LINK],
      }),
      createSoftBreakPlugin({
        rules: [
          {
            hotkey: 'enter',
            query: {
              allow: [ELEMENT_BLOCKQUOTE],
            },
          },
        ],
      }),
      createExitBreakPlugin({
        rules: [
          {
            hotkey: 'enter',
          },
        ],
      }),

      createHashtagPlugin(),
      mentionPlugin,
    ];

    return pluginsBasic;
  }, [mentionPlugin]);

  const editor = useStoreEditorState('main');
  const [showImageUpload, toggleImageUpload] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'link' | null>(null);
  const [showModalLink, toggleModalLink] = useState(false);
  const [showModalImageLink, toggleModalImageLink] = useState(false);
  const [showVideoUpload, toggleVideoUpload] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSize, setUploadSize] = useState(0);
  const [uploadIndex, setUploadIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (mentionQuery.length > 0) {
      onSearchMention && onSearchMention(mentionQuery);
    }
  }, [mentionQuery]);

  useEffect(() => {
    if (uploadIndex > 0 && uploadSize > 0) {
      const totalProgress = (100 * (uploadIndex - 1)) / uploadSize + uploadProgress / uploadSize;
      setProgress(totalProgress);
    }
  }, [uploadProgress]);

  const onChangeDebug = (value: TNode[]) => {
    if (debug) {
      console.log('[DEBUG]:', value);
    }

    onChange && onChange(value);
  };

  const closeImageUpload = () => {
    toggleImageUpload(false);
  };

  const closeVideoUpload = () => {
    toggleVideoUpload(false);
  };

  const closeLinkModal = () => {
    toggleModalLink(false);
  };

  const closeImageLinkModal = () => {
    toggleModalImageLink(false);
  };

  const getImageUrl = (type: 'upload' | 'link'): void => {
    if (!editor) return;

    setImageUploadType(type);

    if (type === 'upload') {
      toggleImageUpload(prevState => !prevState);
    } else {
      toggleModalImageLink(prevState => !prevState);
    }
  };

  const getVideoUrl = (): void => {
    if (!editor) return;

    toggleVideoUpload(prevState => !prevState);
  };

  const openLinkEditor = (event: React.MouseEvent<HTMLSpanElement>): void => {
    if (!editor) return;

    event.preventDefault();

    setCurrentSelection(editor.selection);

    toggleModalLink(prevState => !prevState);
  };

  const handleImageLinkSelected = (result: string | null) => {
    if (result) {
      handleImageSelected(result);
    }
  };

  const handleImageSelected = async (result: File[] | string) => {
    setUploadLoading(true);

    const urls: string[] = [];

    if (imageUploadType === 'upload' && Array.isArray(result) && onFileUploaded) {
      setUploadSize(result.length);

      for (const image of result) {
        setUploadIndex(prevIndex => prevIndex + 1);

        const url = await onFileUploaded(image, 'image');

        if (url) {
          urls.push(url);
        }
      }
    }

    if (imageUploadType === 'link' && typeof result === 'string') {
      urls.push(result);
    }

    if (editor) {
      for (const url of urls) {
        insertImage(editor, url);
      }
    }

    setImageUploadType(null);
    toggleImageUpload(false);
    toggleModalImageLink(false);
    setUploadLoading(false);
    setUploadSize(0);
    setUploadIndex(0);
  };

  const handleVideoSelected = async (result: File[] | string) => {
    setUploadLoading(true);

    if (editor && Array.isArray(result) && onFileUploaded) {
      setUploadSize(1);
      setUploadIndex(1);
      const url = await onFileUploaded(result[0], 'video');

      if (url) {
        insertNodes(editor, {
          type: ELEMENT_MEDIA_EMBED,
          url,
          children: [{text: ''}],
        });
      }
    }

    if (editor && typeof result === 'string') {
      insertNodes(editor, {
        type: ELEMENT_MEDIA_EMBED,
        url: result,
        children: [{text: ''}],
      });
    }

    ReactEditor.focus(editor as ReactEditor);

    setUploadLoading(false);
    toggleVideoUpload(false);
    setUploadSize(0);
    setUploadIndex(0);
  };

  const handleConfirmLink = (url: string | null) => {
    if (editor && currentSelection) {
      Transforms.select(editor as Editor, currentSelection);
      ReactEditor.focus(editor as ReactEditor);

      if (!url) {
        unwrapNodes(editor, {
          at: currentSelection,
          match: {type: getPlatePluginType(editor, ELEMENT_LINK)},
        });

        return;
      }

      const shouldWrap: boolean = isCollapsed(currentSelection);
      upsertLinkAtSelection(editor, {url, wrap: shouldWrap});
      setCurrentSelection(null);
    }

    toggleModalLink(false);
  };

  return (
    <Box className={styles.root}>
      <Plate
        editableProps={editableProps}
        onChange={onChangeDebug}
        plugins={plugins}
        components={components}
        options={options}>
        <HeadingToolbar className={styles.header}>
          <ToolbarElementList />
          <ToolbarButtonsMarks />
          <ToolbarButtonsAlign />
          <ToolbarButtonsList />
          <ToolbarLink icon={<Link />} onMouseDown={openLinkEditor} />
          <ToolbarMedia openImageUpload={getImageUrl} openVideoUpload={getVideoUrl} />
        </HeadingToolbar>

        <MentionSelect {...getMentionSelectProps()} renderLabel={renderMentionLabel} />
      </Plate>

      <Modal
        title="Upload Picture"
        align="left"
        titleSize="small"
        maxWidth="xl"
        open={showImageUpload}
        onClose={closeImageUpload}>
        <Upload
          type="image"
          progress={progress}
          loading={uploadLoading}
          multiple={true}
          onFileSelected={handleImageSelected}
          accept={['image/*']}
        />
      </Modal>

      <Modal
        title="Upload Video"
        align="left"
        titleSize="small"
        maxWidth="xl"
        open={showVideoUpload}
        onClose={closeVideoUpload}>
        <Upload
          type="video"
          progress={progress}
          loading={uploadLoading}
          onFileSelected={handleVideoSelected}
          accept={['video/*']}
          maxSize={100}
          placeholder="Upload .mp4 video file with size less than 100Mb"
        />
      </Modal>

      <Modal
        title="Embed Link"
        align="left"
        titleSize="small"
        maxWidth="xl"
        open={showModalLink}
        onClose={closeLinkModal}>
        <EmbedURL onConfirm={handleConfirmLink} />
      </Modal>

      <Modal
        title="Embed Image"
        align="left"
        titleSize="small"
        maxWidth="xl"
        open={showModalImageLink}
        onClose={closeImageLinkModal}>
        <EmbedURL onConfirm={handleImageLinkSelected} />
      </Modal>
    </Box>
  );
};
