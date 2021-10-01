import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {PostCreate} from '.';
import {Post} from '../../interfaces/post';
import {RootState} from '../../reducers';
import {fetchPeople, searchPeople} from '../../reducers/people/actions';
import {PeopleState} from '../../reducers/people/reducer';
import {createPost, importPost} from '../../reducers/timeline/actions';
import {useUpload} from './hooks/use-upload.hook';

import {debounce} from 'lodash';

type PostCreateContainerType = {
  open: boolean;
  onClose: () => void;
};

export const PostCreateContainer: React.FC<PostCreateContainerType> = props => {
  const {open, onClose} = props;

  const dispatch = useDispatch();
  const {uploadImage, uploadVideo} = useUpload();
  const {people} = useSelector<RootState, PeopleState>(state => state.peopleState);

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const handleSearchPeople = debounce((query: string) => {
    dispatch(searchPeople(query));
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
      people={people}
      onClose={onClose}
      onSubmit={submitPost}
      onSearchPeople={handleSearchPeople}
      onUploadFile={handleFileUpload}
    />
  );
};
