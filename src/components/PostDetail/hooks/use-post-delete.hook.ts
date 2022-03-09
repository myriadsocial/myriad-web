import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Post} from 'src/interfaces/post';
import {deletePost} from 'src/reducers/timeline/actions';

export const usePostDelete = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [postToRemove, setPostToRemove] = useState<Post>();

  const openDeletePostConfirmation = (post: Post) => {
    setPostToRemove(post);
  };

  const closeDeletePostConfirmation = (): void => {
    setPostToRemove(undefined);
  };

  const confirmDeletePost = (): void => {
    closeDeletePostConfirmation();

    if (postToRemove) {
      dispatch(
        deletePost(postToRemove.id, () => {
          router.push('/home');
        }),
      );
    }
  };

  return {
    removing: !!postToRemove,
    openDeletePostConfirmation,
    closeDeletePostConfirmation,
    confirmDeletePost,
  };
};
