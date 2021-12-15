import React from 'react';
import {useDispatch} from 'react-redux';

import {Button, Typography} from '@material-ui/core';

import {PostVisibility} from './PostVisibility';

import {PromptComponent} from 'src/components-v2/atoms/Prompt/prompt.component';
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
      handleSaveChanges();
    }
  };

  const handleSaveChanges = () => {
    const newVisibility = {visibility: visibility};

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
        subtitle={<Typography>Post visibility successfully changed to {visibility}</Typography>}
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
            <Typography>
              Your about to change visibility to&nbsp;
              <Typography component="span" color="primary">
                Only me,
              </Typography>
            </Typography>
            <Typography>
              this post might&nbsp;
              <Typography component="span" color="error">
                lose a chance to gain tip
              </Typography>
            </Typography>
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
          <Button size="small" variant="contained" color="primary" onClick={handleSaveChanges}>
            Yes, Let’s go
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
