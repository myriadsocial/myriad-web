import {
  createAlignPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createImagePlugin,
  createItalicPlugin,
  createKbdPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createMentionPlugin,
  createParagraphPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  ELEMENT_PARAGRAPH,
  ImageElement,
  MentionElement,
  MentionInputElement,
  Plate,
  TEditableProps,
  TMentionElement,
  TComboboxItem,
  withProps,
  TNodeProps,
} from '@udecode/plate';
import {createComboboxPlugin} from '@udecode/plate-combobox';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Grid, LinearProgress, Snackbar, Typography} from '@material-ui/core';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';

import {formatToString} from '../NodeViewer/formatter';
import {EditorValue, Mentionable, MentionDetail} from './Editor.interface';
import {useStyles} from './Editor.style';
import {
  alignmentPlugin,
  baseUIElements,
  exitBreakPlugin,
  resetBlockTypePlugin,
  softBreakPlugin,
} from './config';
import {
  createCharLimitPlugin,
  createEmojiPlugin,
  createHashtagPlugin,
  createImageListPlugin,
  ELEMENT_HASHTAG,
} from './plugins';
import {MediaEmbedElement, MentionCombobox} from './render/Element';
import {
  Toolbar,
  ToolbarAlignButtons,
  ToolbarBasicButtons,
  ToolbarListButtons,
  ToolbarMarksButtons,
} from './render/Toolbar';
import {
  EmojiPickerToolbarButton,
  ImageToolbarButton,
  LinkToolbarButton,
  MediaEmbedToolbarButton,
} from './render/Toolbar/Button';
import {usePlateEditorRef} from './store';
import {createEditorPlugins, initial} from './util';
import {dataURItoBlob} from './utils/image';

import {ListItemComponent} from 'src/components/atoms/ListItem';
import {User} from 'src/interfaces/user';
import * as UploadAPI from 'src/lib/api/upload';

const MAX_CHARACTER_LIMIT = 5000;
const MAX_HASHTAG_CHAR_LENGTH = 160;

const editableProps: TEditableProps<EditorValue> = {
  spellCheck: false,
  autoFocus: true,
  readOnly: false,
  placeholder: 'Type…',
};

const plateUI = createPlateUI({
  ...baseUIElements,
  [ELEMENT_MENTION_INPUT]: withProps(MentionInputElement, {
    prefix: '@',
  }),
  [ELEMENT_MENTION]: withProps(MentionElement, {
    renderLabel: (mentionable: TMentionElement): string => {
      return '@' + mentionable.username;
    },
    styles: {
      root: {
        backgroundColor: 'transparent',
        color: '#7342CC',
        fontWeight: 600,
      },
    },
  }),
});

const corePlugins = createEditorPlugins([
  createParagraphPlugin(),
  createBlockquotePlugin(),
  createCodeBlockPlugin(),
  createHeadingPlugin(),

  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createStrikethroughPlugin(),
  createKbdPlugin(),

  createResetNodePlugin(resetBlockTypePlugin),
  createSoftBreakPlugin(softBreakPlugin),
  createExitBreakPlugin(exitBreakPlugin),
  createAlignPlugin(alignmentPlugin),
  createListPlugin(),
  createTodoListPlugin(),
  createLinkPlugin(),
  createMediaEmbedPlugin({
    component: MediaEmbedElement,
  }),
  createComboboxPlugin(),
  createMentionPlugin({
    component: withProps(MentionElement, {
      renderLabel: (mentionable: TMentionElement) => '@' + mentionable.username,
      styles: {
        root: {
          backgroundColor: 'transparent',
          color: '#7342CC',
          fontWeight: 600,
        },
      },
    }),
    options: {
      trigger: '@',
      inputCreation: {key: 'creationId', value: 'main'},
      insertSpaceAfterMention: true,
      createMentionNode: (item: Mentionable) => {
        const element: TNodeProps<TMentionElement> = {
          value: item.key,
          name: item.data.name,
          username: item.data.username,
        };
        return element;
      },
    },
    isInline: true,
  }),
  createHashtagPlugin({
    options: {
      maxLength: MAX_HASHTAG_CHAR_LENGTH,
    },
  }),
  createEmojiPlugin(),
  createCharLimitPlugin({
    options: {
      max: MAX_CHARACTER_LIMIT,
    },
  }),
  createImageListPlugin(),
  createTrailingBlockPlugin({
    type: ELEMENT_PARAGRAPH,
  }),
  createSelectOnBackspacePlugin({
    options: {
      query: {
        allow: [ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE, ELEMENT_MENTION, ELEMENT_HASHTAG],
      },
    },
  }),
]);

export type EditorProps = {
  userId: string;
  mobile?: boolean;
  onSearchMention: (query: string) => void;
};

export const Editor: React.FC<EditorProps> = props => {
  const {userId, onSearchMention} = props;

  const styles = useStyles();
  const containerRef = useRef(null);
  const editorRef = usePlateEditorRef(userId);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [value, setValue] = useState<EditorValue>();
  const charCount = value
    ? value
        .map(element => formatToString(element))
        .join('')
        .trim().length
    : 0;

  const plugins = useMemo(() => {
    const handleFileUpload = async (dataURI: string | ArrayBuffer): Promise<string> => {
      if (dataURI instanceof ArrayBuffer) {
        console.log('buffer');
      }

      if (typeof dataURI === 'string') {
        const file = dataURItoBlob(dataURI);
        setUploading(true);
        const {files} = await UploadAPI.imageAsBuffer(userId, file, {
          onUploadProgress: (event: ProgressEvent) => {
            const fileProgress = Math.round((100 * event.loaded) / event.total);

            setProgress(fileProgress);
          },
        });

        setUploading(false);
        setProgress(0);

        if (files.length) {
          return files[0].url;
        }
      }
    };

    return createEditorPlugins(
      [
        ...corePlugins,
        createImagePlugin({
          component: withProps(ImageElement, {
            caption: {
              disabled: true,
            },
          }),
          options: {
            uploadImage: handleFileUpload,
          },
        }),
      ],
      {
        components: plateUI,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corePlugins, plateUI]);

  useEffect(() => {
    return (): void => {
      editorRef.children = initial;
    };
  }, []);

  const handleChange = (value: EditorValue) => {
    setValue(value);
  };

  const renderComboboxItem = useCallback(({item}) => {
    return <ListItemComponent title={item.data.name} avatar={item.data.avatar} />;
  }, []);

  const formatLabel = (people: User): TComboboxItem<MentionDetail> => {
    return {
      key: people.id,
      text: people.name,
      data: {
        name: people.name,
        username: people.username,
        avatar: people.profilePictureURL,
      },
    };
  };

  return (
    <div className={`${styles.root} ${styles.large}`}>
      <Toolbar className={styles.toolbar}>
        <ToolbarBasicButtons />
        <ToolbarMarksButtons />
        <ToolbarAlignButtons />
        <ToolbarListButtons />
        <LinkToolbarButton icon={<LinkIcon />} />
        <ImageToolbarButton userId={userId} icon={<ImageIcon />} />
        <MediaEmbedToolbarButton userId={userId} icon={<OndemandVideoIcon />} />
        <EmojiPickerToolbarButton icon={<EmojiEmotionsIcon />} />
      </Toolbar>

      <div ref={containerRef} className={styles.editor}>
        <Plate id={userId} editableProps={editableProps} plugins={plugins} onChange={handleChange}>
          <MentionCombobox<MentionDetail>
            onRenderItem={renderComboboxItem}
            onSearch={onSearchMention}
            formatLabel={formatLabel}
            maxSuggestions={6}
            styles={{
              root: {
                zIndex: 1301,
              },
            }}
          />
        </Plate>

        <Typography variant="body1" component="div" className={styles.limit}>
          {charCount}/{MAX_CHARACTER_LIMIT}
        </Typography>
      </div>

      <Snackbar
        open={uploading}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}>
        <Grid className={styles.progress}>
          <Typography variant="subtitle1">Upload Progress {progress}%</Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Grid>
      </Snackbar>
    </div>
  );
};
