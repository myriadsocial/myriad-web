import {useDispatch} from 'react-redux';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {upvote, setDownvoting, removeVote} from 'src/reducers/timeline/actions';

export const usePostInteraction = () => {
  const dispatch = useDispatch();

  const upVotePost = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const setDownVotingPost = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const removePostVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  return {
    upVotePost,
    removePostVote,
    setDownVotingPost,
  };
};
