import {useContext} from 'react';

import ModalAddToPostContext, {HandleConfirmAddPostExperience} from './ModalAddToPost.context';

const useModalAddToPost = (): HandleConfirmAddPostExperience => {
  const addPostToExperience = useContext(ModalAddToPostContext);

  if (!addPostToExperience) {
    throw new Error('addPostToExperience must be used within a ModalAddToPostProvider');
  }

  return addPostToExperience;
};

export default useModalAddToPost;
