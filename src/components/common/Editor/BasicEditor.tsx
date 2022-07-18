import {
  createBlockquotePlugin,
  createExitBreakPlugin,
  createLinkPlugin,
  createMentionPlugin,
  createParagraphPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  MentionElement,
  Plate,
  TComboboxItem,
  TMentionElement,
  TNodeProps,
  withProps,
} from '@udecode/plate';
import {TEditableProps} from '@udecode/plate';
import {createComboboxPlugin} from '@udecode/plate-combobox';

import React, {useCallback, useRef} from 'react';

import {EditorValue, Mentionable, MentionDetail} from './Editor.interface';
import {useStyles} from './Editor.style';
import {exitBreakPlugin} from './config/exitBreak';
import {resetBlockTypePlugin} from './config/resetBlockType';
import {softBreakPlugin} from './config/softBreak';
import {createHashtagPlugin} from './plugins';
import {createCharLimitPlugin} from './plugins/CharLimit';
import {MentionCombobox} from './render/Element/Mention';
import {createEditorPlugins} from './util';

import {ListItemComponent} from 'components/atoms/ListItem';
import {User} from 'src/interfaces/user';

const MAX_CHARACTER_LIMIT = 5000;
const MAX_HASHTAG_CHAR_LENGTH = 160;

const plugins = createEditorPlugins([
  createParagraphPlugin(),
  createBlockquotePlugin(),
  createResetNodePlugin(resetBlockTypePlugin),
  createSoftBreakPlugin(softBreakPlugin),
  createExitBreakPlugin(exitBreakPlugin),
  createLinkPlugin(),
  createComboboxPlugin(),
  createMentionPlugin({
    component: withProps(MentionElement, {
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
  createCharLimitPlugin({
    options: {
      max: MAX_CHARACTER_LIMIT,
    },
  }),
  createSelectOnBackspacePlugin({
    options: {
      query: {
        allow: [ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE],
      },
    },
  }),
]);

export type BasicEditorProps = {
  id: string;
  placeholder?: string;
  onSearchMention: (query: string) => void;
};

export const BasicEditor: React.FC<BasicEditorProps> = props => {
  const {id, placeholder = 'Write a Reply ...', onSearchMention} = props;

  const styles = useStyles();
  const containerRef = useRef(null);
  const editableProps: TEditableProps<EditorValue> = {
    spellCheck: false,
    autoFocus: true,
    readOnly: false,
    placeholder,
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
    <div className={styles.root}>
      <div ref={containerRef}>
        <Plate id={id} editableProps={editableProps} plugins={plugins}>
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
      </div>
    </div>
  );
};
