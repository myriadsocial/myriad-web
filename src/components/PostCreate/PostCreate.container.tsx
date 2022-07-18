import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Button, useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

import {PromptComponent} from '../atoms/Prompt/prompt.component';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {PostImportError} from 'src/lib/api/errors/post-import.error';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {loadUsers, searchUsers} from 'src/reducers/search/actions';
import {createPost, importPost} from 'src/reducers/timeline/actions';

type PostCreateContainerType = {
  open: boolean;
  onClose: () => void;
};

const PostCreate = dynamic(() => import('./PostCreate'), {ssr: false});

export const PostCreateContainer: React.FC<PostCreateContainerType> = props => {
  const {open, onClose} = props;

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const enqueueSnackbar = useEnqueueSnackbar();

  const user = useSelector<RootState, User>(state => state.userState.user, shallowEqual);
  const [dialogFailedImport, setDialogFailedImport] = useState({
    open: false,
    message: '',
  });

  useEffect(() => {
    dispatch(loadUsers());
  }, []);

  const handleSearchPeople = useCallback(
    (query: string) => {
      console.log('handleSearchPeople', query);

      if (user) {
        dispatch(searchUsers(query));
      }
    },
    [user],
  );

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
        user={user}
        open={open}
        onClose={onClose}
        onSearchPeople={handleSearchPeople}
        onSubmit={submitPost}
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
