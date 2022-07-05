import React from 'react';
import {useDispatch} from 'react-redux';

import {Typography} from '@material-ui/core';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {PostVisibility} from './PostVisibility';

import {PostVisibility as Visibility} from 'src/interfaces/post';
import {Post} from 'src/interfaces/post';
import i18n from 'src/locale';
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
      title: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Private_Title'),
      description: i18n.t(
        'Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Private_Description',
      ),
      confirmationText: i18n.t(
        'Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Private_Text',
      ),
      cancellationText: i18n.t(
        'Post_Detail.Post_Options.Post_Visibility_Setting.Cancel_Private_Text',
      ),
      onConfirm: () => {
        handleSaveChanges();
      },
    });
  };

  const openSuccessPrompt = (updatedVisibility: string) => {
    confirm({
      title: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Title'),
      description: (
        <Typography>
          {updatedVisibility === Visibility.FRIEND
            ? i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Description', {
                visibility: 'Friend Only',
              })
            : updatedVisibility === Visibility.PRIVATE
            ? i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Description', {
                visibility: 'Only Me',
              })
            : i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Description', {
                visibility: updatedVisibility,
              })}
        </Typography>
      ),
      confirmationText: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Text'),
      hideCancel: true,
      onConfirm: () => {
        //code
      },
    });
  };

  const handlePostVisibility = (type: string) => {
    setVisibility(type);

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
          openSuccessPrompt(newVisibility.visibility);
        }),
      );
  };

  if (!reference) return null;

  return (
    <>
      <PostVisibility
        open={false}
        reference={reference}
        onClose={onClose}
        onVisibilityChanged={handlePostVisibility}
      />
    </>
  );
};
