import {
  createAlignPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
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
  createStrikethroughPlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  ELEMENT_MENTION,
  ImageElement,
  MentionElement,
  Plate,
  withProps,
} from '@udecode/plate';

import React, {useMemo, useRef, useState} from 'react';

import {alignmentPlugin, baseUIElements} from '../Editor/config';
import {createEmojiPlugin} from '../Editor/plugins';
import {createHashtagPlugin} from '../Editor/plugins/Hashtag';
import {createImageListPlugin} from '../Editor/plugins/ImageList';
import {createShowMorePlugin, ELEMENT_SHOW_MORE} from '../Editor/plugins/ShowMore';
import {MediaEmbedElement} from '../Editor/render/Element/MediaEmbed';
import {ShowMoreElement} from '../Editor/render/Element/ShowMore';
import {createEditorPlugins} from '../Editor/util';
import {useStyles} from './NodeViewer.style';
import {deserialize, minimize} from './formatter';

import {ReportType} from 'src/interfaces/comment';

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
  createHashtagPlugin(),
  createImagePlugin({
    component: withProps(ImageElement, {
      caption: {
        disabled: true,
      },
    }),
  }),
  createImageListPlugin(),
  createEmojiPlugin(),
]);

export type NodeViewerProps = {
  id: string;
  text: string;
  reportType?: ReportType;
  expand?: boolean;
};

export const NodeViewer: React.FC<NodeViewerProps> = props => {
  const {id, text, reportType, expand} = props;
  const styles = useStyles();
  const containerRef = useRef(null);

  const [elements, setElements] = useState(minimize(text, reportType, expand ? null : 250));

  const toggleShowMore = () => {
    const value = deserialize(text);

    setElements(value);
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
          editableProps={{readOnly: true}}
          plugins={plugins}
          value={elements}
        />
      </div>
    </div>
  );
};
