import React from 'react';

import {PostImporter} from './PostImporter';

import {Post} from 'src/interfaces/post';

type Props = {
  post: Post | null;
  onClose: () => void;
};

export const PostImporterContainer: React.FC<Props> = props => {
  const {post, onClose} = props;
  const isOpen = Boolean(post);

  return <PostImporter open={isOpen} post={post} onClose={onClose} />;
};

export default PostImporterContainer;
