import React from 'react';

import {CommentDisplayComponent} from './comment-display';
import {CommentComponentProps} from './comment.interface';

export const CommentComponent: React.FC<CommentComponentProps> = props => {
  const {comments} = props;
  const deep = props.deep ? props.deep : 1;

  return (
    <>
      {comments &&
        comments.map(comment => (
          <CommentDisplayComponent deep={deep} key={comment.id} comment={comment} />
        ))}
    </>
  );
};
