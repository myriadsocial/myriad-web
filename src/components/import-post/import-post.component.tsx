import React, {useState} from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import {Tweet} from 'react-twitter-widgets';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import DialogTitle from '../common/DialogTitle.component';
import {useStyles} from './import-post.style';

import ShowIf from 'src/components/common/show-if.component';
import {generateRedditEmbedUrl} from 'src/helpers/url';
import {usePostHook} from 'src/hooks/use-post.hook';
import {Experience} from 'src/interfaces/experience';
import {SocialsEnum} from 'src/interfaces/index';
import {User} from 'src/interfaces/user';

type ImportPostProps = {
  user: User;
  experiences: Experience[];
};

const regex = {
  [SocialsEnum.TWITTER]: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/,
  [SocialsEnum.FACEBOOK]:
    /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.|touch\.|mbasic\.)?(?:facebook\.com|fb(?:\.me|\.com))\/(?!$)(?:(?:\w)*#!\/)?(?:pages\/)?(?:photo\.php\?fbid=)?(?:[\w\-]*\/)*?(?:\/)?(?:profile\.php\?id=)?([^\/?&\s]*)(?:\/|&|\?)?.*$/s,
  [SocialsEnum.REDDIT]: /(?:^.+?)(?:reddit.com\/r)(?:\/[\w\d]+){2}(?:\/)([\w\d]*)/,
};

const ImportPostComponent: React.FC<ImportPostProps> = ({user}) => {
  const styles = useStyles();

  const {importPost} = usePostHook(user);
  const [showImportPost, setCreatePost] = useState(false);

  const [postURL, setPostURL] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [social, setSocial] = useState<SocialsEnum | null>(null);
  const [postId, setPostId] = useState('');

  const toggleImportPost = () => {
    setCreatePost(!showImportPost);
  };

  const handleUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    // reset selected social
    setSocial(null);

    // covert social url to embed link
    parseUrl(text);
  };

  const handleUrlPasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');

    // reset selected social
    setSocial(null);

    // covert social url to embed link
    parseUrl(text);
  };

  const parseUrl = (url: string) => {
    const matchTwitter = regex[SocialsEnum.TWITTER].exec(url);
    if (matchTwitter) {
      setPostId(matchTwitter[3]);
      setSocial(SocialsEnum.TWITTER);
    }

    const matchFacebook = regex[SocialsEnum.FACEBOOK].exec(url);
    if (matchFacebook) {
      setPostId(matchFacebook[2]);
      setSocial(SocialsEnum.FACEBOOK);
    }

    const matchReddit = regex[SocialsEnum.REDDIT].exec(url);
    if (matchReddit) {
      setPostId(matchReddit[1]);
      setSocial(SocialsEnum.REDDIT);
      setEmbedUrl(generateRedditEmbedUrl(url));
    }

    setPostURL(url);
  };

  const confirmImport = () => {
    importPost(postURL);
    toggleImportPost();
    setPostURL('');
    setSocial(null);
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
              <Typography variant="caption" style={{marginRight: 24}}>
                Paste URL Link
              </Typography>
              <TextField
                hiddenLabel
                value={postURL}
                onChange={handleUrlChanged}
                onPaste={handleUrlPasted}
                error={postURL.length === 0 && social !== null}
                variant="outlined"
                color="primary"
                margin="dense"
                required
                fullWidth
                name="username"
                type="text"
                id="username"
                InputProps={{
                  color: 'primary',
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
                    title="Reddit preview"
                    src={embedUrl}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    style={{border: 'none'}}
                    height="500"
                    width="580"
                    scrolling="yes"
                  />
                </ShowIf>

                <ShowIf condition={social === SocialsEnum.FACEBOOK || social === null}>
                  <Typography color="textSecondary" style={{margin: '16px 0'}}>
                    Sorry, this feature is in development. You can still import Reddit and Twitter
                    posts though.
                  </Typography>
                </ShowIf>
              </div>
            </CardContent>
            <CardActions className={styles.cardActions}>
              <Button
                variant="contained"
                disabled={social === null}
                size="large"
                color="primary"
                style={{width: 300}}
                onClick={confirmImport}>
                Import now
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportPostComponent;
