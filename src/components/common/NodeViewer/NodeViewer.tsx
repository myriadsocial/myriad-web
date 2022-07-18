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
  ELEMENT_PARAGRAPH,
  ImageElement,
  MentionElement,
  Plate,
  withProps,
} from '@udecode/plate';
import {TEditableProps} from '@udecode/plate';

import React, {useMemo, useRef, useState} from 'react';

import {EditorValue} from '../Editor/Editor.interface';
import {
  alignmentPlugin,
  baseUIElements,
  exitBreakPlugin,
  resetBlockTypePlugin,
  softBreakPlugin,
} from '../Editor/config';
import {createHashtagPlugin, ELEMENT_HASHTAG} from '../Editor/plugins/Hashtag';
import {createImageListPlugin} from '../Editor/plugins/ImageList';
import {createShowMorePlugin, ELEMENT_SHOW_MORE} from '../Editor/plugins/ShowMore';
import {MediaEmbedElement} from '../Editor/render/Element/MediaEmbed';
import {ShowMoreElement} from '../Editor/render/Element/ShowMore';
import {createEditorPlugins} from '../Editor/util';
import {useStyles} from './NodeViewer.style';
import {format, minimize} from './formatter';

import {ReportType} from 'src/interfaces/comment';

export const editableProps: TEditableProps<EditorValue> = {
  spellCheck: false,
  autoFocus: true,
  readOnly: true,
  placeholder: 'Type…',
};

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
  createMentionPlugin({
    isInline: true,
    options: {
      trigger: '@',
      insertSpaceAfterMention: true,
    },
  }),
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
  createHashtagPlugin(),
  createImagePlugin({
    component: withProps(ImageElement, {
      caption: {
        disabled: true,
      },
    }),
  }),
  createImageListPlugin(),
]);

export type NodeViewerProps = {
  id: string;
  text: string;
  reportType?: ReportType;
};

export const NodeViewer: React.FC<NodeViewerProps> = ({id, text, reportType}) => {
  const styles = useStyles();
  const containerRef = useRef(null);

  const [elements, setElements] = useState(minimize(text, reportType, 250));

  const toggleShowMore = () => {
    setElements(format(text));
  };

  const plugins = useMemo(() => {
    return createEditorPlugins([...corePlugins, createShowMorePlugin()], {
      components: createPlateUI({
        ...baseUIElements,
        [ELEMENT_MENTION]: withProps(MentionElement, {
          renderLabel: mentionable => '@' + mentionable.username,
          styles: {
            root: {
              backgroundColor: 'transparent',
              color: '#7342CC',
              fontSize: 14,
              fontWeight: 600,
            },
          },
        }),
        [ELEMENT_SHOW_MORE]: withProps(ShowMoreElement, {
          onToggle: toggleShowMore,
        }),
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corePlugins]);

  return (
    <div className={styles.root}>
      <div ref={containerRef}>
        <Plate
          id={`${id}-${elements.length}`}
          editableProps={editableProps}
          plugins={plugins}
          value={elements}
        />
      </div>
    </div>
  );
};
