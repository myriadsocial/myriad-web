import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import DialogTitle from '../common/DialogTitle.component';

import { Experience } from 'src/interfaces/experience';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      overflow: 'visible'
    },
    label: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white,
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
    postURL: {
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

type Props = {
  onSubmit: (url: string, experienceId: string) => void;
  experiences: Experience[];
};

export default function ImportPostComponent({ onSubmit, experiences }: Props) {
  const styles = useStyles();

  const [showImportPost, setCreatePost] = useState(false);
  const [postURL, setPostURL] = useState('');

  const [selectedExperienceId, setSelectedExperienceId] = useState('');
  const [openSelectExperience, setOpenSelectExperience] = useState(false);

  const handleExperienceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedExperienceId(event.target.value as string);
  };

  const handleExperienceClose = () => {
    setOpenSelectExperience(false);
  };

  const handleExperienceOpen = () => {
    setOpenSelectExperience(true);
  };

  const toggleImportPost = () => {
    setCreatePost(!showImportPost);
  };

  const updatePostURL = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const URL = event.target.value;

    setPostURL(URL);
  };

  const confirmImport = () => {
    onSubmit(postURL, selectedExperienceId);
    toggleImportPost();
    setPostURL('');
  };

  return (
    <div className={styles.root}>
      <InputLabel className={styles.label} onClick={toggleImportPost}>
        <Typography gutterBottom variant="h5" component="h2">
          Import A Post and Send Tips!
        </Typography>
      </InputLabel>

      <Dialog open={showImportPost} aria-labelledby="no-extension-installed" maxWidth="lg">
        <DialogTitle id="name" onClose={toggleImportPost}>
          Import a Post
        </DialogTitle>
        <DialogContent>
          <Card className={styles.postContent}>
            <CardContent>
              <TextField placeholder="Paste the post URL here" className={styles.postURL} value={postURL} onChange={updatePostURL} />

              <FormControl className={styles.formControl}>
                <InputLabel id="select-experience">Experience</InputLabel>
                <>
                  <Select
                    labelId="select-an-experience"
                    id="select-experience"
                    open={openSelectExperience}
                    onClose={handleExperienceClose}
                    onOpen={handleExperienceOpen}
                    value={selectedExperienceId}
                    onChange={handleExperienceChange}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {experiences.map(experience => (
                      <MenuItem key={experience.id} value={experience.id}>
                        {experience.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
                <FormHelperText>Select an experience where the post will be stored</FormHelperText>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button variant="contained" size="large" color="secondary" className={styles.post} onClick={confirmImport}>
                Confirm
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
