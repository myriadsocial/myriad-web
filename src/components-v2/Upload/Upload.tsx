import React, {useState} from 'react';

import {Button} from '@material-ui/core';

import {Dropzone} from '../atoms/Dropzone';
import {useStyles} from './Upload.styles';

type UploadProps = {
  accept: string[];
  maxSize?: number;
  placeholder?: string;
  onFileSelected: (result: File[] | string) => void;
};

export const Upload: React.FC<UploadProps> = props => {
  const {accept, placeholder, maxSize, onFileSelected} = props;
  const styles = useStyles();

  const [files, setFiles] = useState<File[]>([]);
  const handleFileSelected = (files: File[]) => {
    setFiles(files);
  };

  const handleConfirm = () => {
    onFileSelected(files);
  };

  return (
    <div className={styles.root}>
      <Dropzone
        onImageSelected={handleFileSelected}
        accept={accept}
        placeholder={placeholder}
        maxSize={maxSize}
      />

      <Button
        className={styles.confirm}
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleConfirm}
        disabled={files.length === 0}>
        Confirm
      </Button>
    </div>
  );
};
