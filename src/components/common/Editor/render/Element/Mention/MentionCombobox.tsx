import {Data, NoData, TComboboxItem} from '@udecode/plate-combobox';
import {getPluginOptions, usePlateEditorRef} from '@udecode/plate-core';
import {ELEMENT_MENTION, getMentionOnSelectItem, MentionPlugin} from '@udecode/plate-mention';
import {Combobox, ComboboxProps} from '@udecode/plate-ui-combobox';

import {useMemo} from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

export interface MentionComboboxProps<TData extends Data = NoData>
  extends Partial<ComboboxProps<TData>> {
  pluginKey?: string;
  formatLabel: (people: User) => TComboboxItem<TData>;
  onSearch: (query: string) => void;
}

export const MentionCombobox = <TData extends Data = NoData>({
  pluginKey = ELEMENT_MENTION,
  id = pluginKey,
  ...props
}: MentionComboboxProps<TData>) => {
  const {formatLabel, onSearch} = props;

  const editor = usePlateEditorRef()!;
  const {trigger} = getPluginOptions<MentionPlugin>(editor, pluginKey);

  const people = useSelector<RootState, User[]>(
    state => state.searchState.searchedUsers,
    shallowEqual,
  );

  const mentionables: TComboboxItem<TData>[] = useMemo(() => {
    return people.map(person => formatLabel(person));
  }, [people]);

  const handleFilter = (query: string) => {
    onSearch(query);

    return (item: TComboboxItem<TData>) => {
      return true;
    };
  };

  return (
    <Combobox
      id={id}
      items={mentionables}
      trigger={trigger!}
      filter={handleFilter}
      controlled
      onSelectItem={getMentionOnSelectItem({
        key: pluginKey,
      })}
      {...props}
    />
  );
};
