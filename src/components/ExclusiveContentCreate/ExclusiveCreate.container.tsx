import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Button, useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {useStyles} from './ExclusiveCreate.styles';

import {Modal} from 'components/atoms/Modal';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {PostImportError} from 'src/lib/api/errors/post-import.error';
import {getCountPost} from 'src/lib/api/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {loadUsers, searchUsers} from 'src/reducers/search/actions';
import {createPost, importPost} from 'src/reducers/timeline/actions';

type PostCreateContainerType = {
  open: boolean;
  onClose: () => void;
};

const ExclusiveCreate = dynamic(() => import('./ExclusiveCreate'), {ssr: false});

export const ExclusiveCreateContainer: React.FC<PostCreateContainerType> = props => {
  const {open, onClose} = props;
  const confirm = useConfirm();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const enqueueSnackbar = useEnqueueSnackbar();
  const styles = useStyles();

  const user = useSelector<RootState, User | null>(state => state.userState.user, shallowEqual);
  const [dialogFailedImport, setDialogFailedImport] = useState({
    open: false,
    message: '',
    postId: '',
  });

  useEffect(() => {
    dispatch(loadUsers());
  }, []);

  const handleSearchPeople = useCallback(
    (query: string) => {
      if (user) {
        dispatch(searchUsers(query));
      }
    },
    [user],
  );

  const _handlePostNotFullAccess = async () => {
    const response = await getCountPost();
    const count = response.count;
    if (count) {
      confirm({
        title: i18n.t('LiteVersion.LimitTitlePost', {count}),
        description: i18n.t('LiteVersion.LimitDescPost'),
        icon: 'warning',
        confirmationText: i18n.t('LiteVersion.ConnectWallet'),
        cancellationText: i18n.t('LiteVersion.MaybeLater'),
        onConfirm: () => {
          router.push({pathname: '/wallet', query: {type: 'manage'}});
        },
        onCancel: () => {
          undefined;
        },
      });
    }
  };

  const submitPost = useCallback(
    (post: string | Partial<Post>, attributes?: Pick<Post, 'NSFWTag' | 'visibility'>) => {
      if (typeof post === 'string') {
        dispatch(
          importPost(post, attributes, (error: PostImportError | null) => {
            if (error) {
              const {statusCode, message: postId} = error.getErrorData();
              if (statusCode === 422) {
                return confirm({
                  title: i18n.t('LiteVersion.LimitTitlePost', {count: 0}),
                  description: i18n.t('LiteVersion.LimitDescPost'),
                  icon: 'warning',
                  confirmationText: i18n.t('LiteVersion.ConnectWallet'),
                  cancellationText: i18n.t('LiteVersion.MaybeLater'),
                  onConfirm: () => {
                    router.push({pathname: '/wallet', query: {type: 'manage'}});
                  },
                  onCancel: () => {
                    undefined;
                  },
                });
              }
              let message: string = error.message;
              if ([400, 403, 404, 409].includes(statusCode)) {
                message = i18n.t(`Home.RichText.Prompt_Import.Error.${statusCode}`);
              }

              setDialogFailedImport({open: true, message, postId});
            } else {
              user.fullAccess
                ? enqueueSnackbar({
                    message: i18n.t('Post_Import.Success_Toaster'),
                    variant: 'success',
                  })
                : _handlePostNotFullAccess();
            }
          }),
        );
      } else {
        dispatch(
          createPost(
            post,
            [],
            () => {
              user.fullAccess
                ? enqueueSnackbar({
                    message: i18n.t('Post_Create.Success_Toaster'),
                    variant: 'success',
                  })
                : _handlePostNotFullAccess();
            },
            () => {
              confirm({
                title: i18n.t('LiteVersion.LimitTitlePost', {count: 0}),
                description: i18n.t('LiteVersion.LimitDescPost'),
                icon: 'warning',
                confirmationText: i18n.t('LiteVersion.ConnectWallet'),
                cancellationText: i18n.t('LiteVersion.MaybeLater'),
                onConfirm: () => {
                  router.push({pathname: '/wallet', query: {type: 'manage'}});
                },
                onCancel: () => {
                  undefined;
                },
              });
            },
          ),
        );
      }

      onClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!user) return null;

  return (
    <>
      <Modal
        title={i18n.t('ExclusiveContent.Create')}
        onClose={onClose}
        open={open}
        fullScreen={isMobile}
        maxWidth="md"
        className={styles.root}>
        <ExclusiveCreate
          user={user}
          onSearchPeople={handleSearchPeople}
          onSubmit={submitPost}
          isMobile={isMobile}
        />
      </Modal>

      <PromptComponent
        title={i18n.t('Home.RichText.Prompt_Import.Title')}
        subtitle={dialogFailedImport.message}
        open={dialogFailedImport.open}
        icon="warning"
        onCancel={() => setDialogFailedImport({...dialogFailedImport, open: false})}>
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
          }}>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDialogFailedImport({...dialogFailedImport, open: false})}>
            {i18n.t('General.OK')}
          </Button>
          {/* TODO: Added translation */}
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => router.push({pathname: `/post/${dialogFailedImport.postId}`})}>
            See post
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};

export default ExclusiveCreateContainer;
