import React from 'react';
import {useDispatch} from 'react-redux';

import {Button, Typography} from '@material-ui/core';

import {PostVisibility} from './PostVisibility';

import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {PostVisibility as Visibility} from 'src/interfaces/post';
import {Post} from 'src/interfaces/post';
import {editPost} from 'src/reducers/timeline/actions';

type ReportContainerProps = {
  reference: Post | null;
  onClose: () => void;
};

export const PostVisibilityContainer: React.FC<ReportContainerProps> = props => {
  const {reference, onClose} = props;
  const isOpen = Boolean(reference);
  const [open, setOpen] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [visibility, setVisibility] = React.useState('');

  const dispatch = useDispatch();

  const openPrompt = () => {
    setOpen(!open);
  };

  const closePrompt = () => {
    setOpen(false);
    setOpenConfirmation(false);
    onClose();
  };

  const handleOpenConfirmation = () => {
    setOpenConfirmation(!openConfirmation);
  };

  const handlePostVisibility = async (type: string) => {
    await setVisibility(type);

    if (type === Visibility.PRIVATE) {
      handleOpenConfirmation();
    } else {
      handleSaveChanges(type);
    }
  };

  const handleSaveChanges = (type?: string) => {
    const newVisibility = {visibility: type ?? visibility};

    reference &&
      dispatch(
        editPost(reference.id, newVisibility, () => {
          openPrompt();
        }),
      );
  };

  if (!reference) return null;

  return (
    <>
      <PostVisibility
        open={isOpen}
        reference={reference}
        onClose={onClose}
        onVisibility={handlePostVisibility}
      />
      <PromptComponent
        title="Post visibility changed!"
        subtitle={
          <Typography>
            Post visibility successfully changed to{' '}
            {visibility === Visibility.FRIEND
              ? 'friends only'
              : visibility === Visibility.PRIVATE
              ? 'Only Me'
              : visibility}
          </Typography>
        }
        icon="success"
        open={open}
        onCancel={openPrompt}>
        <Button size="small" variant="contained" color="primary" onClick={closePrompt}>
          Back to timeline
        </Button>
      </PromptComponent>
      <PromptComponent
        title="Are you sure?"
        subtitle={
          <>
            <Typography>By setting the visibility setting to&nbsp; "Only Me",</Typography>
            <Typography>you will not be able to receive any tips from other users.</Typography>
          </>
        }
        icon="warning"
        open={openConfirmation}
        onCancel={handleOpenConfirmation}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button
            style={{marginRight: 12}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleOpenConfirmation}>
            No, Let me think
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleSaveChanges()}>
            Yes, Let’s go
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
