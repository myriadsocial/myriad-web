import React, {useState, useRef} from 'react';

import {Tooltip} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link';
import PeopleIcon from '@material-ui/icons/People';
import VideocamIcon from '@material-ui/icons/Videocam';
import Autocomplete, {AutocompleteChangeReason} from '@material-ui/lab/Autocomplete';

import {useStyles} from './create-post.style';
import {PreviewImageComponent} from './preview-image.component';

import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {Experience} from 'src/interfaces/experience';
import {Post} from 'src/interfaces/post';
import {UpoadedFile} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import theme from 'src/themes/default';

type CreatePostExpandedProps = {
  user: User;
  post: Partial<Post> | null;
  onSubmit: (post: Partial<Post>, images: File[]) => void;
  experiences?: Experience[];
};

const CreatePostExpandedComponent: React.FC<CreatePostExpandedProps> = ({
  onSubmit,
  post: initialPost,
  user,
}) => {
  const styles = useStyles();

  const uploadImageRef = useRef<HTMLInputElement | null>(null);
  const uploadVideoRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<UpoadedFile[]>([]);
  const [post, setPost] = useState<Partial<Post> | null>(initialPost);
  const [submitting, setSubmitting] = useState(false);

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;

    setPost(prevPost => ({
      ...prevPost,
      text,
    }));
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

      setImages(prevImages => [
        ...prevImages,
        ...Array.from(files)
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/))
          .map((file: File) => ({
            file,
            preview: URL.createObjectURL(file),
          })),
      ]);
    }
  };

  const addToTags = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter') {
      console.log('addToTags', event.target);
    }
  };

  const handleTagsChange = (
    event: React.ChangeEvent<{}>,
    value: (string | string[])[],
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'remove-option') {
      if (typeof value === 'string') {
        setPost(prevPost => ({
          ...prevPost,
          tags: [value],
        }));
      }

      if (typeof value === 'object') {
        setPost(prevPost => ({
          ...prevPost,
          tags: value.flat(),
        }));
      }
    }

    if (reason === 'create-option') {
      const createdTags: string[] = [];

      if (typeof value === 'string') {
        createdTags.push(value);
      }

      if (typeof value === 'object') {
        createdTags.push(...value.flat());
      }

      setPost(prevPost => ({
        ...prevPost,
        tags: createdTags,
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const prevImages = [...images];

    prevImages.splice(index, 1);

    setImages(prevImages);
  };

  const savePost = () => {
    setSubmitting(true);

    if (post) {
      onSubmit(
        post,
        images.map(image => image.file),
      );
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.cardHeader}
        avatar={
          <Avatar
            aria-label={user.name}
            src={user.profilePictureURL}
            style={{height: 55, width: 55}}>
            {acronym(user.name)}
          </Avatar>
        }
        action={
          <Tooltip title="Coming soon" arrow>
            <Button aria-label="post-settings" variant="contained" size="medium" color="primary">
              Post Setting
            </Button>
          </Tooltip>
        }
        title={user.name}
        subheader=""
      />
      <CardContent style={{padding: theme.spacing(1)}}>
        <TextareaAutosize
          rowsMin={5}
          placeholder={`What's on your mind ${user.name}?`}
          className={styles.postTextArea}
          spellCheck={false}
          value={post?.text}
          onChange={updatePostText}
        />

        <Autocomplete
          id="post-tags"
          className={styles.tags}
          freeSolo
          multiple
          style={{paddingTop: 8}}
          value={post?.tags}
          options={[]}
          disableClearable
          onChange={handleTagsChange}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="# Add Tags"
              variant="outlined"
              onKeyDown={addToTags}
            />
          )}
        />

        <div className={styles.additionalAction}>
          <Typography variant="caption" style={{marginRight: 24}}>
            Add something to your post
          </Typography>
          <input
            type="file"
            multiple
            ref={uploadImageRef}
            onChange={handleFileChange}
            style={{display: 'none'}}
            accept="image/*"
          />
          <IconButton color="primary" aria-label="upload images" onClick={selectImages}>
            <ImageIcon />
          </IconButton>
          <input
            type="file"
            multiple
            ref={uploadVideoRef}
            onChange={handleFileChange}
            style={{display: 'none'}}
            accept="image/*"
          />
          <Tooltip title="Coming soon" arrow>
            <IconButton color="primary" aria-label="upload-video" onClick={selectVideo}>
              <VideocamIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Coming soon" arrow>
            <IconButton color="primary" aria-label="add-people">
              <PeopleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Coming soon" arrow>
            <IconButton color="primary" aria-label="add-link">
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </div>

        <ShowIf condition={images.length > 0}>
          <PreviewImageComponent files={images} onRemoveItem={handleRemoveImage} />
        </ShowIf>
      </CardContent>
      <CardActions className={styles.action}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          disabled={submitting || !post?.text || post.text.length === 0}
          className={styles.postButton}
          onClick={savePost}>
          Post Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreatePostExpandedComponent;
