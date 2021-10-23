import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {PostCreate} from '.';
import {Post} from '../../interfaces/post';
import {RootState} from '../../reducers';
import {fetchFriend, searchFriend} from '../../reducers/friend/actions';
import {createPost, importPost} from '../../reducers/timeline/actions';
import {useFriendList} from '../FriendsMenu/hooks/use-friend-list.hook';
import {useUpload} from './hooks/use-upload.hook';

import {debounce} from 'lodash';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

type PostCreateContainerType = {
  open: boolean;
  onClose: () => void;
};

export const PostCreateContainer: React.FC<PostCreateContainerType> = props => {
  const {open, onClose} = props;

  const dispatch = useDispatch();
  const {uploadImage, uploadVideo} = useUpload();
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const mentionable = useFriendList(friends, user);

  useEffect(() => {
    if (user) {
      dispatch(fetchFriend(user));
    }
  }, [dispatch, user]);

  const handleSearchPeople = debounce((query: string) => {
    if (user) {
      dispatch(searchFriend(user, query));
    }
  }, 300);

  const handleFileUpload = async (file: File, type: 'image' | 'video'): Promise<string> => {
    let url = '';

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
      onClose={onClose}
      onSubmit={submitPost}
      onSearchPeople={handleSearchPeople}
      onUploadFile={handleFileUpload}
    />
  );
};
