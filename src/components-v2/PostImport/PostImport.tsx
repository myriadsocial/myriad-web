import {isUrl} from '@udecode/plate-common';

import React, {useEffect, useState} from 'react';

import {FormControl, Input, InputLabel, Typography} from '@material-ui/core';

import {Embed} from '../atoms/Embed';
import {useStyles} from './PostImport.styles';

type PostImportProps = {
  value?: string;
  onChange: (url: string | null) => void;
};

export const PostImport: React.FC<PostImportProps> = props => {
  const {value = '', onChange} = props;
  const styles = useStyles();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(value);

    if (isUrl(value)) {
      setPreviewUrl(value);
    }

    return () => {
      setPreviewUrl(null);
    };
  }, [value]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const url = event.target.value;

    setUrl(url);

    if (isUrl(url)) {
      setPreviewUrl(url);
      onChange(url);
    } else {
      setPreviewUrl('');
    }
  };

  return (
    <div className={styles.root}>
      <FormControl fullWidth className={styles.input}>
        <InputLabel htmlFor="link-to-post">Link to post</InputLabel>
        <Input id="link-to-post" value={url} onChange={handleUrlChange} />
      </FormControl>

      {previewUrl && (
        <div>
          <Typography variant="h5" gutterBottom className={styles.title}>
            Post Preview
          </Typography>

          <div className={styles.preview}>
            <Embed url={previewUrl} options={{facebookAppId: '1349208398779551'}} />
          </div>
        </div>
      )}
    </div>
  );
};
