import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../../../reducers';
import {upvote, downvote} from '../../../reducers/timeline/actions';
import {CommentList} from './CommentList';

import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';

type CommentListContainerProps = {
  referenceId: string;
  placeholder?: string;
  section: SectionType;
};

export const CommentListContainer: React.FC<CommentListContainerProps> = props => {
  const {placeholder, referenceId, section} = props;

  const dispatch = useDispatch();
  const {comments, loadInitComment, reply, updateUpvote, updateDownvote, loadReplies} =
    useCommentHook(referenceId);

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);

  useEffect(() => {
    loadInitComment();
  }, [referenceId]);

  const handleSubmitComment = (comment: Partial<CommentProps>) => {
    if (user) {
      reply(user, {
        ...comment,
        postId: referenceId,
        referenceId: comment.referenceId ?? referenceId,
        type: comment.type ?? ReferenceType.POST,
        userId: user.id,
        section: comment.section ?? section,
      } as CommentProps);
    }
  };

  const handleUpvote = (comment: Comment) => {
    dispatch(
      upvote(comment, section, () => {
        updateUpvote(comment.id, comment.metric.upvotes + 1);
      }),
    );
  };

  const handleDownvote = (comment: Comment) => {
    dispatch(
      downvote(comment, section, () => {
        updateDownvote(comment.id, comment.metric.upvotes - 1);
      }),
    );
  };

  return (
    <>
      <CommentList
        user={user}
        comments={comments || []}
        placeholder={placeholder}
        onComment={handleSubmitComment}
        onDownvote={handleDownvote}
        onUpvote={handleUpvote}
        onLoadReplies={loadReplies}
      />
    </>
  );
};
