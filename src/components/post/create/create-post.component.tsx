import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VideocamIcon from '@material-ui/icons/Videocam';

import { CreatePostExpandedComponent } from './create-post-expanded.component';
import { useStyles } from './create-post.style';
import { PostSettingComponent } from './post-setting.component';

import DialogTitle from 'src/components/common/DialogTitle.component';
import { Experience } from 'src/interfaces/experience';
import { User } from 'src/interfaces/user';
import theme from 'src/themes/default';

type Props = {
  user: User;
  onSubmit: (text: string, tags: string[], files: File[]) => void;
  experiences: Experience[];
};

export default function CreatePostComponent({ onSubmit, user, experiences }: Props) {
  const styles = useStyles();

  const [postText, setPostText] = useState('');
  const [showCreatePost, setCreatePost] = useState(false);

  const toggleCreatePost = () => {
    setCreatePost(!showCreatePost);
  };

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;

    setPostText(text);
  };

  const savePost = (text: string, tags: string[], files: File[]) => {
    onSubmit(text, tags, files);

    toggleCreatePost();
  };

  return (
    <div className={styles.root} id="create-post">
      <div style={{ padding: theme.spacing(0, 0, 1, 0), position: 'relative' }}>
        <Typography variant="h4" style={{ marginBottom: 8, fontWeight: 500 }}>
          {'Post Something'}
        </Typography>
        <div style={{ position: 'absolute', right: 0, top: -8 }}>
          <PostSettingComponent />
        </div>
      </div>
      <Card variant="outlined" className={styles.cardPost}>
        <CardContent>
          <TextareaAutosize
            rowsMin={2}
            placeholder={`Any thought about something`}
            className={styles.postTextArea}
            onChange={updatePostText}
            spellCheck={false}
          />
        </CardContent>
        <CardActions className={styles.cardPostAction}>
          <Button variant="outlined" color="primary" className={styles.button} onClick={toggleCreatePost} startIcon={<CameraAltIcon />}>
            Post Photos
          </Button>
          <Button variant="outlined" color="primary" disabled className={styles.button} startIcon={<VideocamIcon />}>
            Post Videos
          </Button>
          <Button variant="contained" color="primary" className={styles.createPost} onClick={toggleCreatePost}>
            Create A Post
          </Button>
        </CardActions>
      </Card>

      <Dialog className={styles.dialog} open={showCreatePost} aria-labelledby="no-extension-installed" maxWidth="lg">
        <DialogTitle id="name" onClose={toggleCreatePost}>
          Post Something
        </DialogTitle>
        <DialogContent>
          <CreatePostExpandedComponent text={postText} onSubmit={savePost} user={user} experiences={[]} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
