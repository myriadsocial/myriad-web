import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {PostCreate} from '.';
import {useUpload} from './hooks/use-upload.hook';

import {debounce} from 'lodash';
import {RootState} from 'src/reducers';
import {fetchPeople, searchPeople} from 'src/reducers/people/actions';
import {PeopleState} from 'src/reducers/people/reducer';

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
  }, 500);

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

  const submitPost = () => {
    onClose();
  };

  return (
    <PostCreate
      open={open}
      value=""
      people={people}
      onClose={onClose}
      onSubmit={submitPost}
      onSearchPeople={handleSearchPeople}
      onUploadFile={handleFileUpload}
    />
  );
};
