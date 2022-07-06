import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {Post} from 'src/interfaces/post';
import {removeVote, setDownvoting, upvote} from 'src/reducers/timeline/actions';

export const usePostInteractionHook = () => {
  const dispatch = useDispatch();

  const upvotePost = useCallback((reference: Post) => {
    dispatch(upvote(reference));
  }, []);

  const toggleDownvotePost = useCallback((reference: Post) => {
    dispatch(setDownvoting(reference));
  }, []);

  const removePostVote = useCallback((reference: Post) => {
    dispatch(removeVote(reference));
  }, []);

  return {
    upvotePost,
    toggleDownvotePost,
    removePostVote,
  };
};
