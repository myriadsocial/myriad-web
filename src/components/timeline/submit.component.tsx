import React, { useState, useRef } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
//import FormControl from '@material-ui/core/FormControl';
//import FormHelperText from '@material-ui/core/FormHelperText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
//import MenuItem from '@material-ui/core/MenuItem';
//import Select from '@material-ui/core/Select';
import Slide from '@material-ui/core/Slide';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme, lighten } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import DialogTitle from '../common/DialogTitle.component';

import AddTagComponent from 'src/components/common/AddTag.component';
import ShowIf from 'src/components/common/show-if.component';
import { Experience } from 'src/interfaces/experience';

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
      marginLeft: 'auto !important',
      marginTop: theme.spacing(2)
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
    },
    tag: {
      margin: theme.spacing(2, 0)
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(2)
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  })
);

type UpoadedFile = {
  file: File;
  preview: string;
};

type Props = {
  onSubmit: (text: string, tags: string[], files: File[]) => void;
  experiences: Experience[];
};

export default function SubmitPostComponent({ onSubmit, experiences }: Props) {
  const styles = useStyles();

  const uploadFieldRef = useRef<HTMLInputElement | null>(null);

  const [showCreatePost, setCreatePost] = useState(false);
  const [files, setFiles] = useState<UpoadedFile[]>([]);
  const [postText, setPostText] = useState('');
  const [openTag, setOpenTag] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // TODO: Associate a post with an experience

  //const [selectedExperience, setSelectedExperience] = useState('');
  //const [openSelectExperience, setOpenSelectExperience] = useState(false);

  //const handleExperienceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //setSelectedExperience(event.target.value as string);
  //};

  //const handleExperienceClose = () => {
  //setOpenSelectExperience(false);
  //};

  //const handleExperienceOpen = () => {
  //setOpenSelectExperience(true);
  //};

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

  const openInputTag = () => {
    setOpenTag(!openTag);
  };

  const addTag = (text: string) => {
    if (text.length) {
      setTags([...tags, text]);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.splice(index, 1));
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
              {
                // Associate a post with an experience
                //<FormControl className={styles.formControl}>
                //<InputLabel id="select-experience">Experience</InputLabel>
                //<>
                //<Select
                //labelId="select-an-experience"
                //id="select-experience"
                //open={openSelectExperience}
                //onClose={handleExperienceClose}
                //onOpen={handleExperienceOpen}
                //value={selectedExperience}
                //onChange={handleExperienceChange}>
                //<MenuItem value="">
                //<em>None</em>
                //</MenuItem>
                //{experiences.map(experience => (
                //<MenuItem key={experience.id} value={experience.id}>
                //{experience.name}
                //</MenuItem>
                //))}
                //</Select>
                //</>
                //<FormHelperText>Select an experience where the post will be stored</FormHelperText>
                //</FormControl>
              }

              <div className={styles.tag}>
                {tags.map((tag, index) => {
                  return <Chip size="small" label={tag} color="primary" onDelete={() => removeTag(index)} />;
                })}
              </div>

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
                <Slide direction="right" in={openTag} mountOnEnter>
                  <span>
                    <AddTagComponent onSubmit={addTag} placeholder="Input post tag" />
                  </span>
                </Slide>
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
