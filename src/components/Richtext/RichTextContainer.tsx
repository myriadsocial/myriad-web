import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {RichTextComponent} from '.';
import {PostCreateContainer} from '../PostCreate';

import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const RichTextContainer: React.FC = () => {
  const router = useRouter();

  const {user, alias, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const [createPostOpened, setCreatePostOpened] = useState(false);

  const handleOpenCreatePost = () => {
    setCreatePostOpened(true);
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpened(false);

    router.push('/home', undefined, {shallow: true});
  };

  if (anonymous) return null;

  return (
    <>
      <RichTextComponent
        userProfilePict={user?.profilePictureURL || ''}
        onOpenCreatePost={handleOpenCreatePost}
        alias={alias}
        name={user?.name}
      />

      <PostCreateContainer open={createPostOpened} onClose={handleCloseCreatePost} />
    </>
  );
};
