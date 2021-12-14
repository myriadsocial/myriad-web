import React from 'react';
import {useDispatch} from 'react-redux';

import {PostVisibility} from './PostVisibility';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Post} from 'src/interfaces/post';
import {editPost} from 'src/reducers/timeline/actions';

type ReportContainerProps = {
  reference: Post | null;
  onClose: () => void;
};

export const PostVisibilityContainer: React.FC<ReportContainerProps> = props => {
  const {reference, onClose} = props;
  const isOpen = Boolean(reference);

  const dispatch = useDispatch();
  const {openToasterSnack} = useToasterSnackHook();

  const handlePostVisibility = (type: string) => {
    if (reference) {
      const newVisibility = {visibility: type};
      dispatch(
        editPost(reference.id, newVisibility, () => {
          onClose();
          openToasterSnack({
            message: 'Post visibility has been changed',
            variant: 'success',
          });
        }),
      );
    }
  };

  if (!reference) return null;

  return (
    <PostVisibility
      open={isOpen}
      reference={reference}
      onClose={onClose}
      onVisibility={handlePostVisibility}
    />
  );
};
