import React from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {Comment} from '../../../interfaces/comment';
import {CommentDetail} from '../CommentDetail';
import {CommentEditor} from '../CommentEditor';

type CommentListProps = {
  comments: Comment[];
  deep?: number;
  placeholder?: string;
  focus?: boolean;
  expand?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
);

export const CommentList: React.FC<CommentListProps> = props => {
  const {comments = [], deep = 0, placeholder, focus, expand} = props;

  const styles = useStyles();

  const handleSubmitCommit = (comment: string) => {
    //
  };

  return (
    <div className={styles.root}>
      {deep === 0 && (
        <CommentEditor
          placeholder={placeholder || ''}
          onSubmit={handleSubmitCommit}
          username={'asda'}
          avatar={'asdas'}
          focus={focus}
          expand={expand}
        />
      )}

      {comments.map(comment => (
        <CommentDetail key={comment.id} comment={comment} deep={deep} />
      ))}
    </div>
  );
};
