import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Button, useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

import {PromptComponent} from '../atoms/Prompt/prompt.component';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {debounce} from 'lodash';
import {useUpload} from 'src/hooks/use-upload.hook';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {PostImportError} from 'src/lib/api/errors/post-import.error';
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
  const enqueueSnackbar = useEnqueueSnackbar();

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

  const handleSearchPeople = useCallback(
    debounce((query: string) => {
      if (user) {
        dispatch(searchUsers(query));
      }
    }, 300),
    [],
  );

  const handleFileUpload = useCallback(async (file: File, type: 'image' | 'video'): Promise<
    string | null
  > => {
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
  }, []);

  const submitPost = useCallback(
    (post: string | Partial<Post>, attributes?: Pick<Post, 'NSFWTag' | 'visibility'>) => {
      if (typeof post === 'string') {
        dispatch(
          importPost(post, attributes, (error: PostImportError | null) => {
            if (error) {
              const {statusCode} = error.getErrorData();
              let message: string = error.message;

              if ([400, 403, 404, 409].includes(statusCode)) {
                message = i18n.t(`Home.RichText.Prompt_Import.Error.${statusCode}`);
              }

              setDialogFailedImport({open: true, message});
            } else {
              enqueueSnackbar({
                message: i18n.t('Post_Import.Success_Toaster'),
                variant: 'success',
              });
            }
          }),
        );
      } else {
        dispatch(
          createPost(post, [], () => {
            enqueueSnackbar({
              message: i18n.t('Post_Create.Success_Toaster'),
              variant: 'success',
            });
          }),
        );
      }

      onClose();
    },
    [],
  );

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
