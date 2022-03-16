import React from 'react';
import {useDispatch} from 'react-redux';

import {Typography} from '@material-ui/core';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {PostVisibility} from './PostVisibility';

import {PostVisibility as Visibility} from 'src/interfaces/post';
import {Post} from 'src/interfaces/post';
import {editPost} from 'src/reducers/timeline/actions';

type PostVisibilityContainerProps = {
  reference: Post | null;
  onClose: () => void;
};

export const PostVisibilityContainer: React.FC<PostVisibilityContainerProps> = props => {
  const {reference, onClose} = props;

  const [visibility, setVisibility] = React.useState('');

  const dispatch = useDispatch();
  const confirm = useConfirm();

  const confirmChangeToPrivate = () => {
    confirm({
      title: 'Are you sure?',
      description:
        'By setting the visibility setting to "Only Me",\nthis post will not be able to receive any tips from other users',
      confirmationText: "Yes, Let's go",
      cancellationText: 'No, let me rethink',
      onConfirm: () => {
        handleSaveChanges();
      },
    });
  };

  const openSuccessPrompt = () => {
    confirm({
      title: 'Post visibility changed!',
      description: (
        <Typography>
          Post visibility successfully changed to&nbsp;
          {visibility === Visibility.FRIEND
            ? 'friends only'
            : visibility === Visibility.PRIVATE
            ? 'Only Me'
            : visibility}
        </Typography>
      ),
      confirmationText: 'Back to timeline',
      hideCancel: true,
      onConfirm: () => {
        //code
      },
    });
  };

  const handlePostVisibility = async (type: string) => {
    await setVisibility(type);

    if (type === Visibility.PRIVATE) {
      confirmChangeToPrivate();
    } else {
      handleSaveChanges(type);
    }
  };

  const handleSaveChanges = (type?: string) => {
    const newVisibility = {visibility: type ?? visibility};

    reference &&
      dispatch(
        editPost(reference.id, newVisibility, () => {
          openSuccessPrompt();
        }),
      );
  };

  if (!reference) return null;

  return (
    <>
      <PostVisibility
        open={Boolean(reference)}
        reference={reference}
        onClose={onClose}
        onVisibility={handlePostVisibility}
      />
    </>
  );
};
