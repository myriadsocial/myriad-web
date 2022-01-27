import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Button} from '@material-ui/core';

import {useFriendList} from '../FriendsMenu/hooks/use-friend-list.hook';
import {PromptComponent} from '../atoms/Prompt/prompt.component';

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
  const [openFailedImport, setOpenFailedImport] = useState(false);
  const [failedMessage, setFailedMessage] = useState('');

  useEffect(() => {
    if (user && friends.length === 0) {
      dispatch(fetchFriend());
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

  const submitPost = (
    post: string | Partial<Post>,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility'>,
  ) => {
    if (typeof post === 'string') {
      dispatch(
        importPost(post, attributes, (errorCode: number) => {
          if (errorCode === 404) {
            setFailedMessage(
              'You are trying to import a post formerly deleted \n by a Myriad administrator',
            );
          } else if (errorCode === 422) {
            setFailedMessage('You can not import this post, \n because the account is private');
          } else if (errorCode === 409) {
            setFailedMessage(
              'Sorry, you can not import this post, \n because this post has been imported',
            );
          }
          setOpenFailedImport(true);
        }),
      );
    } else {
      dispatch(createPost(post));
    }

    onClose();
  };

  return (
    <>
      <PostCreate
        open={open}
        people={mentionable}
        uploadProgress={progress}
        onClose={onClose}
        onSubmit={submitPost}
        onSearchPeople={handleSearchPeople}
        onUploadFile={handleFileUpload}
      />
      <PromptComponent
        title={'Import Failed!'}
        subtitle={failedMessage}
        open={openFailedImport}
        icon="warning"
        onCancel={() => setOpenFailedImport(false)}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setOpenFailedImport(false)}>
            Okay
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
