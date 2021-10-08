import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {RichTextComponent} from '.';
import {PostCreateContainer} from '../PostCreate';

import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const RichTextContainer: React.FC = () => {
  const {user, alias} = useSelector<RootState, UserState>(state => state.userState);

  const [createPostOpened, setCreatePostOpened] = useState(false);

  const handleOpenCreatePost = () => {
    setCreatePostOpened(true);
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpened(false);
  };

  return (
    <>
      <RichTextComponent
        userProfilePict={user?.profilePictureURL || ''}
        onOpenCreatePost={handleOpenCreatePost}
        alias={alias}
      />

      <PostCreateContainer open={createPostOpened} onClose={handleCloseCreatePost} />
    </>
  );
};
