import React, { useState, useRef } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import VideocamIcon from '@material-ui/icons/Videocam';
import Autocomplete, { AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';

import { useStyles } from './create-post.style';
import { PreviewImageComponent } from './preview-image.component';

import DialogTitle from 'src/components/common/DialogTitle.component';
import ShowIf from 'src/components/common/show-if.component';
import { acronym } from 'src/helpers/string';
import { Experience } from 'src/interfaces/experience';
import { User } from 'src/interfaces/user';
import theme from 'src/themes/default';

type UpoadedFile = {
  file: File;
  preview: string;
};

type Props = {
  user: User;
  onSubmit: (text: string, tags: string[], files: File[]) => void;
  experiences: Experience[];
};

export default function CreatePostComponent({ onSubmit, user, experiences }: Props) {
  const styles = useStyles();

  const uploadImageRef = useRef<HTMLInputElement | null>(null);
  const uploadVideoRef = useRef<HTMLInputElement | null>(null);
  const [showCreatePost, setCreatePost] = useState(false);
  const [files, setFiles] = useState<UpoadedFile[]>([]);
  const [postText, setPostText] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const toggleCreatePost = () => {
    setCreatePost(!showCreatePost);
  };

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;

    setPostText(text);
  };

  const selectVideo = (): void => {
    const uploadField: any = uploadVideoRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  const selectImages = (): void => {
    const uploadField: any = uploadImageRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;

      setFiles(
        Array.from(files)
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/))
          .map((file: File) => ({
            file,
            preview: URL.createObjectURL(file)
          }))
      );

      setCreatePost(true);
    }
  };

  const addToTags = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter') {
      console.log('addToTags', event.target);
    }
  };

  const handleTagsChange = (event: React.ChangeEvent<{}>, value: (string | string[])[], reason: AutocompleteChangeReason) => {
    console.log(value, reason);

    if (reason === 'clear') {
    }

    if (reason === 'create-option') {
      let createdTags: string[] = [];

      if (typeof value === 'string') {
        createdTags.push(value);
      }

      if (typeof value === 'object') {
        createdTags.push(...value.flat());
      }
      console.log('createdTags', createdTags);
      setTags([...createdTags]);
    }
  };

  const savePost = () => {
    onSubmit(
      postText,
      tags,
      files.map(file => file.file)
    );

    toggleCreatePost();
    setPostText('');
    setFiles([]);
  };

  const togglePostSetting = () => {};

  return (
    <div className={styles.root}>
      <div style={{ padding: theme.spacing(0, 0, 1, 0), position: 'relative' }}>
        <Typography variant="h4" style={{ marginBottom: 8, fontWeight: 500 }}>
          {'Post Something'}
        </Typography>
        <div style={{ position: 'absolute', right: 0, top: -8 }}>
          <IconButton onClick={togglePostSetting} disableFocusRipple>
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
      <Card variant="outlined">
        <CardContent style={{ background: '#C4C4C4' }}>
          <TextareaAutosize
            rowsMin={2}
            placeholder={`Any thought about something`}
            className={styles.postTextArea}
            onChange={updatePostText}
            spellCheck={false}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" color="default" className={styles.button} onClick={toggleCreatePost} startIcon={<CameraAltIcon />}>
            Post Photos
          </Button>
          <Button variant="contained" color="default" disabled className={styles.button} startIcon={<VideocamIcon />}>
            Post Videos
          </Button>
          <Button variant="contained" color="default" className={styles.createPost} onClick={toggleCreatePost}>
            Create A Post
          </Button>
        </CardActions>
      </Card>

      <Dialog className={styles.dialog} open={showCreatePost} aria-labelledby="no-extension-installed" maxWidth="lg">
        <DialogTitle id="name" onClose={toggleCreatePost}>
          Post Something
        </DialogTitle>
        <DialogContent>
          <Card className={styles.card}>
            <CardHeader
              className={styles.cardHeader}
              avatar={
                <Avatar aria-label={user.name} src={user.profilePictureURL} style={{ height: 55, width: 55 }}>
                  {acronym(user.name)}
                </Avatar>
              }
              action={
                <Button aria-label="post-settings" variant="contained" size="medium" color="primary">
                  Post Setting
                </Button>
              }
              title={user.name}
              subheader=""
            />
            <CardContent style={{ padding: theme.spacing(1) }}>
              <TextareaAutosize
                rowsMin={5}
                placeholder={`Any thought about something, ${user.name}?`}
                className={styles.postTextArea}
                spellCheck={false}
                value={postText}
                onChange={updatePostText}
              />

              <Autocomplete
                id="post-tags"
                className={styles.tags}
                freeSolo
                multiple
                style={{ paddingTop: 8 }}
                value={tags}
                options={[]}
                forcePopupIcon={false}
                onChange={handleTagsChange}
                renderInput={params => <TextField {...params} placeholder="# Add Tags" variant="outlined" onKeyDown={addToTags} />}
              />

              <div className={styles.additionalAction}>
                <Typography variant="caption" style={{ marginRight: 24 }}>
                  Add somenting to your post
                </Typography>
                <input type="file" multiple ref={uploadImageRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                <IconButton color="default" aria-label="upload images" onClick={selectImages}>
                  <ImageIcon />
                </IconButton>
                <input type="file" multiple ref={uploadVideoRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                <IconButton aria-label="upload-video" disabled color="default" onClick={selectVideo}>
                  <VideocamIcon />
                </IconButton>
                <IconButton color="default" disabled aria-label="add-people">
                  <PeopleIcon />
                </IconButton>
                <IconButton color="default" disabled aria-label="add-link">
                  <LinkIcon />
                </IconButton>
              </div>

              <ShowIf condition={files.length > 0}>
                <PreviewImageComponent files={files} />
              </ShowIf>
            </CardContent>
            <CardActions>
              <Button variant="contained" size="large" color="primary" className={styles.postButton} onClick={savePost}>
                Post Now
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
