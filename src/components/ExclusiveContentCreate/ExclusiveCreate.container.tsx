import React, {useCallback, useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

import {useStyles} from './ExclusiveCreate.styles';

import {Modal} from 'components/atoms/Modal';
import {ExclusiveContentPost} from 'src/interfaces/exclusive';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {loadUsers, searchUsers} from 'src/reducers/search/actions';

type PostCreateContainerType = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (
    post: ExclusiveContentPost,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility'>,
  ) => void;
};

const ExclusiveCreate = dynamic(() => import('./ExclusiveCreate'), {ssr: false});

export const ExclusiveCreateContainer: React.FC<PostCreateContainerType> = props => {
  const {open, onClose, onSubmit} = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const styles = useStyles();

  const user = useSelector<RootState, User | null>(state => state.userState.user, shallowEqual);

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
          onSubmit={onSubmit}
          isMobile={isMobile}
        />
      </Modal>
    </>
  );
};

export default ExclusiveCreateContainer;
