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
  createListPlugin,
  createMediaEmbedPlugin,
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
  ELEMENT_PARAGRAPH,
  ImageElement,
  MentionElement,
  Plate,
  TEditableProps,
  TMentionElement,
  TComboboxItem,
  withProps,
  TNodeProps,
  ELEMENT_MENTION_INPUT,
} from '@udecode/plate';
import {createComboboxPlugin} from '@udecode/plate-combobox';

import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Grid, LinearProgress, Snackbar, Typography} from '@material-ui/core';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';

import {EditorProps} from '../CKEditor/Editor.interface';
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
  createLinkPlugin,
  createMentionPlugin,
} from './plugins';
import {Counter} from './render/Counter';
import {MediaEmbedElement, MentionCombobox} from './render/Element';
import {MentionInputElement} from './render/Element/Mention/MentionInput';
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
import {createEditorPlugins, initial} from './util';
import {dataURItoBlob} from './utils/image';

import {debounce} from 'lodash';
import {ListItemComponent} from 'src/components/atoms/ListItem';
import {User} from 'src/interfaces/user';
import * as UploadAPI from 'src/lib/api/upload';

const MAX_CHARACTER_LIMIT = 5000;
const MAX_HASHTAG_CHAR_LENGTH = 160;

const editableProps: TEditableProps<EditorValue> = {
  spellCheck: false,
  autoFocus: true,
  readOnly: false,
};

const plateUI = createPlateUI({
  ...baseUIElements,
  [ELEMENT_IMAGE]: withProps(ImageElement, {
    caption: {
      disabled: true,
    },
  }),
  [ELEMENT_MEDIA_EMBED]: withProps(MediaEmbedElement, {}),
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
        fontSize: 'inherit',
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
  createMediaEmbedPlugin(),
  createComboboxPlugin(),
  createMentionPlugin({
    options: {
      trigger: '@',
      insertSpaceAfterMention: true,
      inputCreation: {key: 'creationId', value: 'main'},
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
        allow: [ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE],
      },
    },
  }),
]);

export const Editor: React.FC<EditorProps> = props => {
  const {userId, mobile, onSearchMention, isErrorEditor = false, placeholder} = props;

  const styles = useStyles({mobile, counter: true});
  const ref = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const plugins = useMemo(() => {
    const handleFileUpload = async (dataURI: string | ArrayBuffer): Promise<string> => {
      if (dataURI instanceof ArrayBuffer) {
        // code
      }

      if (typeof dataURI === 'string') {
        const file = dataURItoBlob(dataURI);
        setUploading(true);
        const {files} = await UploadAPI.imageAsBuffer(file, {
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

  const handleSearchMention = useCallback(
    debounce((query: string) => {
      onSearchMention(query);
    }, 300),
    [],
  );

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
    <div
      className={`${styles.root} ${styles.large} ${styles.editorWrapper}`}
      style={{borderColor: isErrorEditor ? '#FE3333' : '#E0E0E0'}}>
      <Toolbar className={styles.toolbar}>
        {!mobile && <ToolbarBasicButtons />}
        <ToolbarMarksButtons />
        {!mobile && <ToolbarAlignButtons />}
        <ToolbarListButtons />
        <LinkToolbarButton icon={<LinkIcon />} />
        <ImageToolbarButton userId={userId} icon={<ImageIcon />} />
        <MediaEmbedToolbarButton userId={userId} icon={<OndemandVideoIcon />} />
        {!mobile && <EmojiPickerToolbarButton icon={<EmojiEmotionsIcon />} />}
      </Toolbar>

      <div ref={ref} className={styles.editor}>
        <Plate
          id={userId}
          editableProps={{...editableProps, placeholder: placeholder ?? 'Type...'}}
          plugins={plugins}
          initialValue={initial}>
          <MentionCombobox<MentionDetail>
            onRenderItem={renderComboboxItem}
            onSearch={handleSearchMention}
            formatLabel={formatLabel}
            maxSuggestions={6}
            styles={{
              root: {
                zIndex: 1301,
              },
            }}
          />

          <Counter className={styles.limit} limit={MAX_CHARACTER_LIMIT} />
        </Plate>
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

export default Editor;
