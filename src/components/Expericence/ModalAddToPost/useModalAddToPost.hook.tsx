import {useContext} from 'react';

import ModalAddToPostContext, {HandleConfirm} from './ModalAddToPost.context';

const useModalAddToPost = (): HandleConfirm => {
  const addPostToExperience = useContext(ModalAddToPostContext);

  if (!addPostToExperience) {
    throw new Error('addPostToExperience must be used within a ModalAddToPostProvider');
  }

  return addPostToExperience;
};

export default useModalAddToPost;
