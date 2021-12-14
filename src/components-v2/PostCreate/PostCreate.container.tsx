import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {useFriendList} from '../FriendsMenu/hooks/use-friend-list.hook';

import {debounce} from 'lodash';
import {useUpload} from 'src/hooks/use-upload.hook';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {fetchFriend, searchFriend} from 'src/reducers/friend/actions';
import {FriendState} from 'src/reducers/friend/reducer';
import {createPost, importPost} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

type PostCreateContainerType = {
  open: boolean;
  onClose: () => void;
};

const PostCreate = dynamic(() => import('./PostCreate'), {
  ssr: false,
});

export const PostCreateContainer: React.FC<PostCreateContainerType> = props => {
  const {open, onClose} = props;

  const dispatch = useDispatch();
  const {progress, uploadImage, uploadVideo} = useUpload();
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const mentionable = useFriendList(friends, user);

  useEffect(() => {
    if (user && friends.length === 0) {
      dispatch(fetchFriend(user));
    }
  }, [dispatch, user]);

  const handleSearchPeople = debounce((query: string) => {
    if (user) {
      dispatch(searchFriend(user, query));
    }
  }, 300);

  const handleFileUpload = async (file: File, type: 'image' | 'video'): Promise<string | null> => {
    let url: string | null = null;

    if (type === 'image') {
      const response = await uploadImage(file);

      if (response) {
        url = response;
      }
    }

    if (type === 'video') {
      const response = await uploadVideo(file);

      if (response) {
        url = response;
      }
    }

    return url;
  };

  const submitPost = (post: string | Partial<Post>) => {
    if (typeof post === 'string') {
      dispatch(importPost(post));
    } else {
      dispatch(createPost(post));
    }

    onClose();
  };

  return (
    <PostCreate
      open={open}
      people={mentionable}
      uploadProgress={progress}
      onClose={onClose}
      onSubmit={submitPost}
      onSearchPeople={handleSearchPeople}
      onUploadFile={handleFileUpload}
    />
  );
};
