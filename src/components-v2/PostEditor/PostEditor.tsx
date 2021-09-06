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
<<<<<<< HEAD
  useStoreEditorState,
  TNode,
  getPlatePluginType,
  LinkElement,
} from '@udecode/plate';
import {isCollapsed, unwrapNodes} from '@udecode/plate-common';
import {ELEMENT_IMAGE, createImagePlugin} from '@udecode/plate-image';
import {createLinkPlugin, ELEMENT_LINK, upsertLinkAtSelection} from '@udecode/plate-link';
import {ToolbarLink} from '@udecode/plate-link-ui';
import {insertMediaEmbed} from '@udecode/plate-media-embed';
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
=======
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
>>>>>>> 2181b09b (MYR-717: init editor)
import {MentionElement, MentionSelect, renderMentionLabel} from './Render/Mention';
import {ToolbarButtonsAlign} from './Toolbar/ToolbarAlign';
import {ToolbarElementList} from './Toolbar/ToolbarElement';
import {ToolbarButtonsList} from './Toolbar/ToolbarList';
import {ToolbarButtonsMarks, plugins as markPlugins} from './Toolbar/ToolbarMark';
<<<<<<< HEAD
import {ToolbarMedia} from './Toolbar/ToolbarMedia';
import {createHashtagPlugin, ELEMENT_HASHTAG} from './plugins/hashtag';

import {Transforms, Selection, Editor} from 'slate';
import {ReactEditor} from 'slate-react';

export type PostEditorProps = {
  value: TNode[];
  debug?: boolean;
  placeholder?: string;
  mentionable: MentionNodeData[];
  onSearchMention: (query: string) => void;
  onChange?: (value: TNode[]) => void;
  onFileUploaded?: (file: File, type: 'image' | 'video') => Promise<string>;
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
      fontFamily: theme.typography.fontFamily,
      lineHeight: '24px',
      fontSize: 14,
    },
  };

=======
import {createHashtagPlugin, ELEMENT_HASHTAG} from './plugins/hashtag';

const editableProps = {
  placeholder: 'Type…',
  style: {
    padding: 20,
    background: '#FFFFFF',
  },
};

export type PostEditorProps = {
  value: TNode[];
  mentionable: MentionNodeData[];
  onSearchMention: (query: string) => void;
};

export const PostEditor: React.FC<PostEditorProps> = ({mentionable, value, onSearchMention}) => {
  const styles = useStyles();
  const options = createPlateOptions();

>>>>>>> 2181b09b (MYR-717: init editor)
  const components = createPlateComponents({
    [ELEMENT_MENTION]: withProps(MentionElement, {
      renderLabel: renderMentionLabel,
      prefix: '@',
    }),
    [ELEMENT_HASHTAG]: withProps(HashtagElement, {
      prefix: '#',
    }),
<<<<<<< HEAD
    [ELEMENT_MEDIA_EMBED]: withProps(MediaEmbedElement, {}),
    [ELEMENT_LINK]: withProps(LinkElement, {
      styles: {
        root: {
          color: `${theme.palette.primary.main}!important`,
          fontWeight: 700,
        },
      },
    }),
=======
>>>>>>> 2181b09b (MYR-717: init editor)
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
<<<<<<< HEAD
      createSelectOnBackspacePlugin({
        allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED, ELEMENT_MENTION, ELEMENT_HASHTAG],
      }),
=======
      createSelectOnBackspacePlugin({allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED]}),
>>>>>>> 2181b09b (MYR-717: init editor)
      createSoftBreakPlugin(),
      createExitBreakPlugin(),

      createHashtagPlugin(),
      mentionPlugin,
    ];

    return pluginsBasic;
  }, [mentionPlugin]);

<<<<<<< HEAD
  const editor = useStoreEditorState('main');
  const [setImageUrl, setImageUrlPromise] = useState<any>();
  const [showImageUpload, toggleImageUpload] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'link' | null>(null);
  const [showModalLink, toggleModalLink] = useState(false);
  const [showModalImageLink, toggleModalImageLink] = useState(false);
  const [showVideoUpload, toggleVideoUpload] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);

=======
>>>>>>> 2181b09b (MYR-717: init editor)
  useEffect(() => {
    if (mentionQuery.length > 0) {
      onSearchMention && onSearchMention(mentionQuery);
    }
  }, [mentionQuery]);

  const onChangeDebug = (value: TNode[]) => {
<<<<<<< HEAD
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

  const getImageUrl = async (type: 'upload' | 'link'): Promise<string> => {
    let resolve;

    setImageUploadType(type);

    if (type === 'upload') {
      toggleImageUpload(prevState => !prevState);
    } else {
      toggleModalImageLink(prevState => !prevState);
    }

    const promise = new Promise<string>(_resolve => {
      resolve = _resolve;
    });

    // @ts-ignore
    promise.resolve = resolve;

    setImageUrlPromise(promise);

    return promise;
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
    if (typeof result === 'string') {
      setImageUrl.resolve(result);
    }

    if (imageUploadType === 'upload' && Array.isArray(result) && onFileUploaded) {
      const url = await onFileUploaded(result[0], 'image');

      setImageUrl.resolve(url);
    }

    if (imageUploadType === 'link' && typeof result === 'string') {
      setImageUrl.resolve(result);
    }

    setImageUploadType(null);
    toggleImageUpload(false);
    toggleModalImageLink(false);
  };

  const handleVideoSelected = async (result: File[] | string) => {
    if (editor && Array.isArray(result) && onFileUploaded) {
      const url = await onFileUploaded(result[0], 'video');
      insertMediaEmbed(editor, {url});
    }

    if (editor && typeof result === 'string') {
      insertMediaEmbed(editor, {url: result});
    }

    toggleVideoUpload(false);
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
=======
    console.log('[DEBUG]:', value);
>>>>>>> 2181b09b (MYR-717: init editor)
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
<<<<<<< HEAD
          <ToolbarElementList />
          <ToolbarButtonsMarks />
          <ToolbarButtonsAlign />
          <ToolbarButtonsList />
          <ToolbarLink icon={<Link />} onMouseDown={openLinkEditor} />
          <ToolbarMedia getImageUrl={getImageUrl} openVideoUpload={getVideoUrl} />
=======
          <ToolbarButtonsMarks />
          <ToolbarElementList />
          <ToolbarButtonsAlign />
          <ToolbarButtonsList />
          <ToolbarLink icon={<Link />} />
          <ToolbarImage icon={<Image />} />
>>>>>>> 2181b09b (MYR-717: init editor)
        </HeadingToolbar>

        <MentionSelect {...getMentionSelectProps()} renderLabel={renderMentionLabel} />
      </Plate>
<<<<<<< HEAD

      <Modal
        title="Upload Picture"
        align="left"
        titleSize="small"
        maxWidth="xl"
        open={showImageUpload}
        onClose={closeImageUpload}>
        <Upload onFileSelected={handleImageSelected} accept={['image/*']} />
      </Modal>

      <Modal
        title="Upload Video"
        align="left"
        titleSize="small"
        maxWidth="xl"
        open={showVideoUpload}
        onClose={closeVideoUpload}>
        <Upload
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
=======
>>>>>>> 2181b09b (MYR-717: init editor)
    </Box>
  );
};
