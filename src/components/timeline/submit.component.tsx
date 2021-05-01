import React, { useState, useRef } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme, lighten } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import DialogTitle from '../common/DialogTitle.component';

import ShowIf from 'src/components/common/show-if.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      overflow: 'visible'
    },
    label: {
      backgroundColor: lighten(theme.palette.background.paper, 0.3),
      textAlign: 'center',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
      cursor: 'pointer'
    },
    post: {
      marginLeft: 'auto !important'
    },
    postContent: {
      width: 600
    },
    postText: {
      width: '100%',
      padding: theme.spacing(1),
      border: 0,
      borderRadius: 2,
      fontSize: 16
    },
    subtitle: {
      paddingLeft: 0,
      fontSize: 14
    }
  })
);

type UpoadedFile = {
  file: File;
  preview: string;
};

type Props = {
  onSubmit: (text: string, files: File[]) => void;
};

export default function SubmitPostComponent({ onSubmit }: Props) {
  const styles = useStyles();

  const uploadFieldRef = useRef<HTMLInputElement | null>(null);

  const [showCreatePost, setCreatePost] = useState(false);
  const [files, setFiles] = useState<UpoadedFile[]>([]);
  const [postText, setPostText] = useState('');
  const [tags, setTags] = useState<string[]>(['sample tag']);

  const toggleCreatePost = () => {
    setCreatePost(!showCreatePost);
  };

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;

    setPostText(text);
  };

  const selectFile = (): void => {
    const uploadField: any = uploadFieldRef?.current;

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
    }
  };

  const openInputTag = () => {};

  const removeTag = (index: number) => {
    setTags(tags.splice(index, 1));
  };

  const savePost = () => {
    onSubmit(
      postText,
      files.map(file => file.file)
    );

    toggleCreatePost();
    setPostText('');
    setFiles([]);
  };

  return (
    <div className={styles.root}>
      <InputLabel className={styles.label} onClick={toggleCreatePost}>
        <Typography gutterBottom variant="h5" component="h2">
          Post Something
        </Typography>
      </InputLabel>

      <Dialog open={showCreatePost} aria-labelledby="no-extension-installed" maxWidth="lg">
        <DialogTitle id="name" onClose={toggleCreatePost}>
          Create Post
        </DialogTitle>
        <DialogContent>
          <Card className={styles.postContent}>
            <CardContent>
              <TextareaAutosize
                rowsMin={5}
                placeholder="Post Something"
                className={styles.postText}
                spellCheck={false}
                value={postText}
                onChange={updatePostText}
              />

              {tags.map((tag, index) => {
                return <Chip size="small" label={tag} color="primary" onDelete={() => removeTag(index)} />;
              })}

              <ShowIf condition={files.length > 0}>
                <GridList cellHeight={200}>
                  <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                    <ListSubheader className={styles.subtitle} component="span">
                      Added to your post:{' '}
                    </ListSubheader>
                  </GridListTile>
                  {files.map(file => (
                    <GridListTile key={file.file.name}>
                      <img src={file.preview} alt={file.file.name} />
                      <GridListTileBar
                        title={file.file.name}
                        actionIcon={
                          <IconButton aria-label={`info about ${file.file.name}`}>
                            <InfoIcon />
                          </IconButton>
                        }
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </ShowIf>
            </CardContent>
            <CardActions>
              <div>
                <input type="file" multiple ref={uploadFieldRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                <IconButton color="default" aria-label="upload media" onClick={selectFile}>
                  <ImageIcon />
                </IconButton>
                <IconButton color="default" aria-label="add tags" onClick={openInputTag}>
                  <LoyaltyIcon />
                </IconButton>
              </div>
              <Button variant="contained" size="large" color="secondary" className={styles.post} onClick={savePost}>
                Post
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
