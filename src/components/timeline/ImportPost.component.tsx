import React, { useState, useEffect } from 'react';
//@ts-ignore
import { FacebookProvider, EmbeddedPost } from 'react-facebook';
import { Tweet } from 'react-twitter-widgets';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
//import FormControl from '@material-ui/core/FormControl';
//import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
//import MenuItem from '@material-ui/core/MenuItem';
//import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import DialogTitle from '../common/DialogTitle.component';

import ShowIf from 'src/components/common/show-if.component';
import { usePostHook } from 'src/hooks/use-post.hook';
import { Experience } from 'src/interfaces/experience';
import { SocialsEnum } from 'src/interfaces/index';
import { User } from 'src/interfaces/user';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      overflow: 'visible'
    },
    label: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      textAlign: 'center',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
      borderRadius: theme.spacing(1),
      cursor: 'pointer'
    },
    post: {
      marginLeft: 'auto !important',
      marginTop: theme.spacing(2)
    },
    cardActions: {
      justifyContent: 'center',
      background: theme.palette.background.default
    },
    postContent: {
      width: 600,
      padding: theme.spacing(1, 0),
      boxShadow: 'none'
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

const regex = {
  [SocialsEnum.TWITTER]: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/,
  [SocialsEnum.FACEBOOK]: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?\/(?:[\w\-]*)?\/([\w\-]*)/,
  [SocialsEnum.REDDIT]: /(?:^.+?)(?:reddit.com\/r)(?:\/[\w\d]+){2}(?:\/)([\w\d]*)/g
};

export default function ImportPostComponent({ user, experiences }: Props) {
  const styles = useStyles();

  const { importPost } = usePostHook(user);
  const [showImportPost, setCreatePost] = useState(false);

  const [postURL, setPostURL] = useState('');
  const [social, setSocial] = useState<SocialsEnum | null>(null);
  const [postId, setPostId] = useState('');

  useEffect(() => {
    if (postURL.length === 0) {
      setSocial(null);
    }
  }, [postURL]);

  const toggleImportPost = () => {
    setCreatePost(!showImportPost);
  };

  const handleUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    parseUrl(text);

    setPostURL(text);
  };

  const handleUrlPasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');
    parseUrl(text);

    setPostURL(text);
  };

  const parseUrl = (url: string) => {
    const matchTwitter = regex[SocialsEnum.TWITTER].exec(url);
    if (matchTwitter) {
      setPostId(matchTwitter[3]);
      setSocial(SocialsEnum.TWITTER);

      return;
    }

    const matchFacebook = regex[SocialsEnum.FACEBOOK].exec(url);
    if (matchFacebook) {
      setPostId(matchFacebook[2]);
      setSocial(SocialsEnum.FACEBOOK);

      return;
    }

    const matchReddit = regex[SocialsEnum.REDDIT].exec(url);
    if (matchReddit) {
      setPostId(matchReddit[1]);
      setSocial(SocialsEnum.REDDIT);

      return;
    }
  };

  const generateRedditUrl = (url: string) => {
    const newUrl = url.replace('reddit', 'redditmedia');

    return newUrl.substring(0, newUrl.indexOf('?'));
  };

  const confirmImport = () => {
    importPost(postURL);
    toggleImportPost();
    setPostURL('');
  };

  return (
    <div className={styles.root}>
      <InputLabel className={styles.label} onClick={toggleImportPost}>
        <Typography gutterBottom variant="h5" component="h2">
          Import a post
        </Typography>
      </InputLabel>

      <Dialog open={showImportPost} maxWidth="lg">
        <DialogTitle id="name" onClose={toggleImportPost}>
          Import post
        </DialogTitle>

        <DialogContent>
          <Card className={styles.postContent}>
            <CardContent>
              <Typography variant="caption" style={{ marginRight: 24 }}>
                Paste URL Link
              </Typography>
              <TextField
                hiddenLabel
                value={postURL}
                onChange={handleUrlChanged}
                onPaste={handleUrlPasted}
                variant="outlined"
                color="primary"
                margin="dense"
                required
                fullWidth
                name="username"
                type="text"
                id="username"
                InputProps={{
                  color: 'primary'
                }}
              />

              <div>
                <ShowIf condition={social === SocialsEnum.TWITTER}>
                  <Tweet tweetId={postId} />
                </ShowIf>

                <ShowIf condition={social === SocialsEnum.FACEBOOK}>
                  <FacebookProvider appId="1349208398779551">
                    <EmbeddedPost href={postURL} width="700" />
                  </FacebookProvider>
                </ShowIf>

                <ShowIf condition={social === SocialsEnum.REDDIT}>
                  <iframe
                    id="reddit-embed"
                    src={`${generateRedditUrl(postURL)}/?ref_source=embed&amp;ref=share&amp;embed=true&amp;theme=dark`}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    style={{ border: 'none' }}
                    height="500"
                    width="580"
                    scrolling="yes"
                  />
                </ShowIf>
              </div>
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
            </CardContent>
            <CardActions className={styles.cardActions}>
              <Button
                variant="contained"
                disabled={social === null}
                size="large"
                color="primary"
                style={{ width: 300 }}
                onClick={confirmImport}>
                Post now
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
