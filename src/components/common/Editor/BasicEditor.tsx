import {
  createBlockquotePlugin,
  createComboboxPlugin,
  createExitBreakPlugin,
  createLinkPlugin,
  createMentionPlugin,
  createParagraphPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  MentionElement,
  Plate,
  TComboboxItem,
  TEditableProps,
  TMentionElement,
  TNodeProps,
  withProps,
} from '@udecode/plate';

import React, {useCallback, useRef} from 'react';

import {alpha} from '@material-ui/core';

import {EditorValue, Mentionable, MentionDetail} from './Editor.interface';
import {useStyles} from './Editor.style';
import {exitBreakPlugin, resetBlockTypePlugin, softBreakPlugin} from './config';
import {createEmojiPlugin, createHashtagPlugin} from './plugins';
import {createCharLimitPlugin} from './plugins/CharLimit';
import {MentionCombobox, MentionInputElement} from './render/Element/Mention';
import {createEditorPlugins} from './util';

import {ListItemComponent} from 'components/atoms/ListItem';
import debounce from 'lodash/debounce';
import {User} from 'src/interfaces/user';

const MAX_CHARACTER_LIMIT = 5000;
const MAX_HASHTAG_CHAR_LENGTH = 160;

const plugins = createEditorPlugins(
  [
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createResetNodePlugin(resetBlockTypePlugin),
    createSoftBreakPlugin(softBreakPlugin),
    createExitBreakPlugin(exitBreakPlugin),
    createLinkPlugin(),
    createComboboxPlugin(),
    createMentionPlugin({
      options: {
        trigger: '@',
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
    createSelectOnBackspacePlugin({
      options: {
        query: {
          allow: [ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE],
        },
      },
    }),
    createEmojiPlugin(),
    createCharLimitPlugin({
      options: {
        max: MAX_CHARACTER_LIMIT,
      },
    }),
  ],
  {
    components: createPlateUI({
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
    }),
  },
);

export type BasicEditorProps = {
  id: string;
  placeholder?: string;
  onSearchMention: (query: string) => void;
  children?: React.ReactNode;
};

export const BasicEditor: React.FC<BasicEditorProps> = props => {
  const {id, placeholder = 'Write a Reply ...', children, onSearchMention} = props;

  const styles = useStyles({mobile: false});
  const containerRef = useRef(null);
  const editableProps: TEditableProps<EditorValue> = {
    spellCheck: false,
    autoFocus: false,
    readOnly: false,
    placeholder,
  };

  const handleSearchMention = debounce(query => {
    onSearchMention(query);
  }, 300);

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
    <div className={styles.root}>
      <div ref={containerRef} className={styles.editor}>
        <Plate id={id} editableProps={editableProps} plugins={plugins}>
          <MentionCombobox<MentionDetail>
            onRenderItem={renderComboboxItem}
            onSearch={handleSearchMention}
            formatLabel={formatLabel}
            maxSuggestions={6}
            styles={{
              root: {
                zIndex: 1301,
              },
              highlightedItem: {
                backgroundColor: alpha('#FFC857', 0.15),
              },
            }}
          />
          {children}
        </Plate>
      </div>
    </div>
  );
};
