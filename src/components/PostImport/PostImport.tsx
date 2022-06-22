import {isUrl} from '@udecode/plate-common';

import React, {useEffect, useState} from 'react';

import {FormControl, FormHelperText, Input, InputLabel, Typography} from '@material-ui/core';

import {Embed} from '../atoms/Embed';
import {useStyles} from './PostImport.styles';

import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';

type PostImportProps = {
  value?: string;
  onChange: (url: string | null) => void;
  onError: () => void;
};

type ErrorType = 'unsupported' | 'invalid';

const regex = {
  [SocialsEnum.TWITTER]: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/,
  [SocialsEnum.FACEBOOK]:
    /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.|touch\.|mbasic\.)?(?:facebook\.com|fb(?:\.me|\.com))\/(?!$)(?:(?:\w)*#!\/)?(?:pages\/)?(?:photo\.php\?fbid=)?(?:[\w\-]*\/)*?(?:\/)?(?:profile\.php\?id=)?([^\/?&\s]*)(?:\/|&|\?)?.*$/s,
  [SocialsEnum.REDDIT]: /(?:^.+?)(?:reddit.com\/r)(?:\/[\w\d]+){2}(?:\/)([\w\d]*)/,
};

export const PostImport: React.FC<PostImportProps> = props => {
  const {value, onChange, onError} = props;
  const styles = useStyles();

  const [url, setUrl] = useState<string>('');

  const [social, setSocial] = useState<SocialsEnum>();
  const [postId, setPostId] = useState<string>();
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    if (value && value.length > 0 && value !== url) {
      parseUrl(value);
    }
  }, [value]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const url = event.target.value;

    setError(null);
    setUrl(url);
    setSocial(null);
    setPostId(null);

    if (isUrl(url)) {
      parseUrl(url);
    } else {
      setError('unsupported');
      onChange(null);
    }
  };

  const parseUrl = (url: string) => {
    const matchTwitter = regex[SocialsEnum.TWITTER].exec(url);

    if (matchTwitter) {
      setSocial(SocialsEnum.TWITTER);
      setPostId(matchTwitter[3]);

      return;
    }

    const matchReddit = regex[SocialsEnum.REDDIT].exec(url);

    if (matchReddit) {
      setSocial(SocialsEnum.REDDIT);
      setPostId(matchReddit[1]);

      return;
    }

    setError('unsupported');
  };

  const handleOnLoad = () => {
    onChange(url);
  };

  const handleOnError = () => {
    setError('invalid');
    onError();
  };

  console.log('social', social, 'postId', postId);
  console.log('error', error);

  return (
    <div className={styles.root}>
      <FormControl fullWidth className={styles.input} error={Boolean(error)}>
        <InputLabel htmlFor="link-to-post">{i18n.t('Post_Import.Text_Placeholder')}</InputLabel>
        <Input id="link-to-post" value={url} onChange={handleUrlChange} />
        <ShowIf condition={Boolean(error)}>
          <FormHelperText id="component-error-text">
            {i18n.t(`Post_Import.Validation_Message.${error}`)}
          </FormHelperText>
        </ShowIf>
      </FormControl>

      {!error && social && postId && (
        <div>
          <Typography variant="h5" gutterBottom className={styles.title}>
            {i18n.t('Post_Import.Post_Preview')}
          </Typography>

          <div className={styles.preview}>
            <Embed
              social={social}
              postId={postId}
              url={url}
              onError={handleOnError}
              onLoad={handleOnLoad}
            />
          </div>
        </div>
      )}
    </div>
  );
};
