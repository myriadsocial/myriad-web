import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Button, useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

import {PromptComponent} from '../atoms/Prompt/prompt.component';

import {debounce} from 'lodash';
import {useUpload} from 'src/hooks/use-upload.hook';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {loadUsers, searchUsers} from 'src/reducers/search/actions';
import {createPost, importPost} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

type PostCreateContainerType = {
  open: boolean;
  onClose: () => void;
};

const PostCreate = dynamic(() => import('./PostCreate'), {ssr: false});

export const PostCreateContainer: React.FC<PostCreateContainerType> = props => {
  const {open, onClose} = props;

  const dispatch = useDispatch();
  const theme = useTheme();
  const {progress, uploadImage, uploadVideo} = useUpload();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const people = useSelector<RootState, User[]>(state => state.searchState.searchedUsers);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [dialogFailedImport, setDialogFailedImport] = useState({
    open: false,
    message: '',
  });

  useEffect(() => {
    if (user && people.length === 0) {
      dispatch(loadUsers());
    }
  }, [dispatch, user]);

  const handleSearchPeople = debounce((query: string) => {
    if (user) {
      dispatch(searchUsers(query));
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
            setDialogFailedImport({
              open: true,
              message: i18n.t('Home.RichText.Prompt_Import.Subtitle_Deleted'),
            });
          } else if (errorCode === 422) {
            setDialogFailedImport({
              open: true,
              message: i18n.t('Home.RichText.Prompt_Import.Subtitle_Private'),
            });
          } else if (errorCode === 409) {
            setDialogFailedImport({
              open: true,
              message: i18n.t('Home.RichText.Prompt_Import.Subtitle_Duplicate'),
            });
          }
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
        people={people}
        uploadProgress={progress}
        onClose={onClose}
        onSubmit={submitPost}
        onSearchPeople={handleSearchPeople}
        onUploadFile={handleFileUpload}
        isMobile={isMobile}
      />
      <PromptComponent
        title={i18n.t('Home.RichText.Prompt_Import.Title')}
        subtitle={dialogFailedImport.message}
        open={dialogFailedImport.open}
        icon="warning"
        onCancel={() => setDialogFailedImport({...dialogFailedImport, open: false})}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setDialogFailedImport({...dialogFailedImport, open: false})}>
            {i18n.t('General.OK')}
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};

export default PostCreateContainer;
