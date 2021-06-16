//import { LinkPreview } from '@dhaiwat10/react-link-preview';
import React, { useState } from 'react';
import { Tweet } from 'react-twitter-widgets';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import DialogTitle from '../common/DialogTitle.component';

import { usePostHook } from 'src/hooks/use-post.hook';
import { Experience } from 'src/interfaces/experience';
import { User } from 'src/interfaces/user';

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
      borderRadius: 2,
      cursor: 'pointer'
    },
    post: {
      marginLeft: 'auto !important',
      marginTop: theme.spacing(2)
    },
    cardActions: {
      justifyContent: 'center'
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
  user: User;
  experiences: Experience[];
};

export default function ImportPostComponent({ user, experiences }: Props) {
  const styles = useStyles();

  const { importPost } = usePostHook(user);
  const [showImportPost, setCreatePost] = useState(false);

  //Associate a post with an experience
  //const [selectedExperienceId, setSelectedExperienceId] = useState('');
  //const [openSelectExperience, setOpenSelectExperience] = useState(false);

  //const handleExperienceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //setSelectedExperienceId(event.target.value as string);
  //};

  //const handleExperienceClose = () => {
  //setOpenSelectExperience(false);
  //};

  //const handleExperienceOpen = () => {
  //setOpenSelectExperience(true);
  //};

  const toggleImportPost = () => {
    setCreatePost(!showImportPost);
  };

  const confirmImport = () => {
    importPost(social + sansDomain);
    toggleImportPost();
  };

  const [social, setSocial] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [sansDomain, setSansDomain] = useState('');

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSocial(e.target.value as string);
  };

  const handleChangeTweetId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const sansDomain = text.substring(text.indexOf('m') + 2);
    const tweetId = text.substring(text.lastIndexOf('/') + 1);

    setSansDomain(sansDomain);
    setTweetId(tweetId);
  };

  const handleTweetIdPasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');
    const sansDomain = text.substring(text.indexOf('m') + 2);
    const tweetId = text.substring(text.lastIndexOf('/') + 1);

    setSansDomain(sansDomain);
    setTweetId(tweetId);
  };

  return (
    <div className={styles.root}>
      <InputLabel className={styles.label} onClick={toggleImportPost}>
        <Typography gutterBottom variant="h5" component="h2">
          Import a post
        </Typography>
      </InputLabel>

      <Dialog open={showImportPost} aria-labelledby="no-extension-installed" maxWidth="lg">
        <DialogTitle id="name" onClose={toggleImportPost}>
          Import post
        </DialogTitle>
        <DialogContent>
          <Card className={styles.postContent}>
            <CardContent>
              <TextField
                hiddenLabel
                value={sansDomain}
                onChange={handleChangeTweetId}
                onPaste={handleTweetIdPasted}
                color="primary"
                margin="dense"
                required
                fullWidth
                name="username"
                type="text"
                id="username"
                InputProps={{
                  disableUnderline: true,
                  color: 'primary',
                  startAdornment: (
                    <InputAdornment position="start" disableTypography>
                      {social === 'https://twitter.com/' ? 'https://twitter.com/' : 'https://www.facebook.com/'}
                    </InputAdornment>
                  )
                }}
              />
              <FormControl className={styles.formControl}>
                <InputLabel id="demo-simple-select-label">Social Platform</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={social} onChange={handleChange}>
                  <MenuItem value={'https://twitter.com/'}>Twitter</MenuItem>
                  <MenuItem value={'https://www.facebook.com/'}>Facebook</MenuItem>
                </Select>
              </FormControl>
              {
                // TODO: Associate a post with an experience
                //<FormControl className={styles.formControl}>
                //<InputLabel id="select-experience">Experience</InputLabel>
                //<>
                //<Select
                //labelId="select-an-experience"
                //id="select-experience"
                //open={openSelectExperience}
                //onClose={handleExperienceClose}
                //onOpen={handleExperienceOpen}
                //value={selectedExperienceId}
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
              <Tweet tweetId={tweetId} />
            </CardContent>
            <CardActions className={styles.cardActions}>
              <Button variant="contained" size="large" color="secondary" onClick={confirmImport}>
                Post now
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
