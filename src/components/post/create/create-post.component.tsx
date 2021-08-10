import React, {useEffect, useState} from 'react';

import dynamic from 'next/dynamic';

import {Tooltip} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VideocamIcon from '@material-ui/icons/Videocam';

import {useStyles} from './create-post.style';

import DialogTitle from 'src/components/common/DialogTitle.component';
import {usePostHook} from 'src/hooks/use-post.hook';
import {Experience} from 'src/interfaces/experience';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import theme from 'src/themes/default';

const CreatePostExpandedComponent = dynamic(() => import('./create-post-expanded.component'), {
  ssr: false,
});

type CreatePostProps = {
  user: User;
  experiences?: Experience[];
};

const CreatePostComponent: React.FC<CreatePostProps> = ({user}) => {
  const styles = useStyles();

  const {addPost, loading} = usePostHook(user);
  const [post, setPost] = useState<Partial<Post> | null>(null);

  const [showCreatePost, setCreatePost] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (submitting && !loading) {
      toggleCreatePost();
    }

    return () => {
      setPost(null);
    };
  }, [submitting, loading]);

  const toggleCreatePost = () => {
    setCreatePost(!showCreatePost);
    setSubmitting(false);
  };

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;

    setPost(prevPost => ({
      ...prevPost,
      text,
    }));
  };

  const savePost = (post: Partial<Post>, images: File[]) => {
    setSubmitting(true);

    addPost(post, images);
  };

  return (
    <div className={styles.root} id="create-post">
      <div style={{padding: theme.spacing(0, 0, 1, 0), position: 'relative'}}>
        <Typography variant="h4" style={{marginBottom: 8, fontWeight: 500}}>
          {'Post Something'}
        </Typography>
      </div>
      <Card variant="outlined" className={styles.cardPost}>
        <CardContent>
          <TextareaAutosize
            rowsMin={2}
            value={post?.text}
            placeholder={`A penny for your thoughts?`}
            className={styles.postTextArea}
            onChange={updatePostText}
            spellCheck={false}
          />
        </CardContent>
        <CardActions className={styles.cardPostAction}>
          <Button
            variant="outlined"
            color="primary"
            className={styles.button}
            onClick={toggleCreatePost}
            startIcon={<CameraAltIcon />}>
            Post Photos
          </Button>

          <Tooltip title="Coming soon" arrow>
            <Button
              variant="outlined"
              color="primary"
              className={styles.button}
              startIcon={<VideocamIcon />}>
              Post Videos
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            className={styles.createPost}
            onClick={toggleCreatePost}>
            Create A Post
          </Button>
        </CardActions>
        <div
          onClick={toggleCreatePost}
          role="button"
          tabIndex={0}
          aria-hidden="true"
          className={styles.screen}
        />
      </Card>

      <Dialog
        className={styles.dialog}
        open={showCreatePost}
        aria-labelledby="no-extension-installed"
        maxWidth="lg">
        <DialogTitle id="name" onClose={toggleCreatePost}>
          Post Something
        </DialogTitle>

        <DialogContent>
          <CreatePostExpandedComponent post={post} user={user} onSubmit={savePost} />
        </DialogContent>

        {submitting && <CircularProgress size={40} className={styles.buttonProgress} />}
      </Dialog>
    </div>
  );
};

export default CreatePostComponent;
