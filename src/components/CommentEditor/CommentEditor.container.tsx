import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import CommentEditor from './CommentEditor';

import {CommentProps} from 'src/interfaces/comment';
import {ReferenceType, SectionType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import {searchUsers} from 'src/reducers/search/actions';

type CommentEditorContainerProps = {
  user: User;
  referenceId: string;
  section: SectionType;
  type: ReferenceType;
  expand?: boolean;
  onSubmit: (comment: Partial<CommentProps>) => void;
};

const CommentEditorContainer: React.FC<CommentEditorContainerProps> = props => {
  const {user} = props;

  const dispatch = useDispatch();

  const handleSearchPeople = useCallback(
    (query: string) => {
      if (user) {
        dispatch(searchUsers(query));
      }
    },
    [user],
  );

  return <CommentEditor {...props} onSearchMention={handleSearchPeople} />;
};

export default CommentEditorContainer;
