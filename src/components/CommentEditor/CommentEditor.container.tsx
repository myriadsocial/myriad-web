import React, {useCallback, useMemo} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import CommentEditor from './CommentEditor';

import debounce from 'lodash/debounce';
import {CommentProps} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {searchUsers} from 'src/reducers/search/actions';

type CommentEditorContainerProps = {
  user: User;
  referenceId: string;
  placeholder?: string;
  expand?: boolean;
  onSubmit: (comment: Partial<CommentProps>) => void;
};

const CommentEditorContainer: React.FC<CommentEditorContainerProps> = props => {
  const {user} = props;

  const dispatch = useDispatch();

  const people = useSelector<RootState, User[]>(
    state => state.searchState.searchedUsers,
    shallowEqual,
  );

  const mentionables = useMemo(() => {
    return people.map(item => ({
      value: item.id,
      name: item.name,
      username: item.username ?? item.name.replace(' ', ''),
      avatar: item.profilePictureURL,
    }));
  }, [people]);

  const handleSearchPeople = useCallback(
    () =>
      debounce((query: string) => {
        if (user) {
          dispatch(searchUsers(query));
        }
      }, 300),
    [],
  );

  return (
    <CommentEditor {...props} mentionables={mentionables} onSearchMention={handleSearchPeople} />
  );
};

export default CommentEditorContainer;
