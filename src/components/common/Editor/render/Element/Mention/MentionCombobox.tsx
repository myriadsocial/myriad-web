import {Data, NoData, TComboboxItem} from '@udecode/plate-combobox';
import {getPluginOptions, usePlateEditorRef} from '@udecode/plate-core';
import {ELEMENT_MENTION, getMentionOnSelectItem, MentionPlugin} from '@udecode/plate-mention';
import {Combobox, ComboboxProps} from '@udecode/plate-ui-combobox';

import {useCallback} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {searchUsers} from 'src/reducers/search/actions';

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
  const {formatLabel} = props;
  const dispatch = useDispatch();

  const editor = usePlateEditorRef()!;
  const {trigger} = getPluginOptions<MentionPlugin>(editor, pluginKey);

  const mentionables = useSelector<RootState, TComboboxItem<TData>[]>(
    state => state.searchState.searchedUsers.map(person => formatLabel(person)),
    shallowEqual,
  );

  const handleFilter = useCallback((query: string) => {
    setTimeout(() => {
      if (query && query.length > 0) {
        dispatch(searchUsers(query));
      }
    }, 300);

    return (item: TComboboxItem<TData>) => {
      return true;
    };
  }, []);

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
