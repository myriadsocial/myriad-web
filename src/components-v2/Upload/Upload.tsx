import {PhotographIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {Button, FormControl, Input, InputLabel, Typography} from '@material-ui/core';

import {validateImageUrl} from '../../helpers/string';
import {Dropzone} from '../atoms/Dropzone';
import {useStyles} from './Upload.styles';

type UploadProps = {
  title: string;
  accept: string[];
  onFileSelected: (result: File[] | string) => void;
};

type UploadMethod = 'upload' | 'url';

export const Upload: React.FC<UploadProps> = props => {
  const {title, accept, onFileSelected} = props;
  const styles = useStyles();

  const [method, setUploadMethod] = useState<UploadMethod>('upload');

  const changeUploadMethod = (method: UploadMethod) => () => {
    setUploadMethod(method);
  };

  const handleFileSelected = (files: File[]) => {
    onFileSelected(files);
  };

  const handleUrlChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;

    if (validateImageUrl(url)) {
      onFileSelected(url);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <PhotographIcon fontSize="medium" />
        </div>

        <Typography variant="h4">{title}</Typography>
      </div>

      <div className={styles.action}>
        <Typography>
          Upload an {title.toLowerCase()} file, pick one from your media library, or add one with a
          URL
        </Typography>

        <div className={styles.option}>
          <Button
            variant="contained"
            color={method === 'upload' ? 'primary' : 'default'}
            size="small"
            onClick={changeUploadMethod('upload')}>
            Upload
          </Button>
          <Button
            variant="contained"
            size="small"
            color={method === 'url' ? 'primary' : 'default'}
            onClick={changeUploadMethod('url')}>
            Insert from URL
          </Button>
        </div>
      </div>

      {method === 'upload' && <Dropzone onImageSelected={handleFileSelected} accept={accept} />}

      {method === 'url' && (
        <FormControl fullWidth className={styles.input}>
          <InputLabel htmlFor="link-to-file">Link to File</InputLabel>
          <Input id="link-to-file" onChange={handleUrlChanged} />
        </FormControl>
      )}
    </div>
  );
};
