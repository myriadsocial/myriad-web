import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

import {Button, Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import UploadIcon from '../../../images/Icons/Upload.svg';
import {useStyles} from './Dropzone.styles';

type DropzoneProps = {
  value?: string;
  loading?: boolean;
  accept?: string[];
  onImageSelected: (files: File[]) => void;
};

type FileUploaded = File & {
  preview: string;
};

export const Dropzone: React.FC<DropzoneProps> = props => {
  const {onImageSelected, loading, value, accept = ['image/*']} = props;
  const styles = useStyles();

  const [, setFiles] = useState<FileUploaded[]>([]);

  const {getRootProps, getInputProps, open} = useDropzone({
    accept,
    maxFiles: 2000000,
    noClick: true,
    noKeyboard: true,
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );

      onImageSelected(acceptedFiles);
    },
  });

  const handleReuploadImage = () => {
    open();
  };

  return (
    <div className={styles.root}>
      <div {...getRootProps({className: 'dropzone'})} className={styles.dropzone}>
        <input {...getInputProps()} />

        {value ? (
          <div className={styles.preview}>
            <img src={value} alt="experience icon" />
          </div>
        ) : (
          <>
            <UploadIcon />

            <Typography>File must be .jpeg or .png</Typography>
          </>
        )}

        <Button
          className={styles.button}
          size="small"
          variant={value ? 'outlined' : 'contained'}
          color={value ? 'secondary' : 'primary'}
          onClick={handleReuploadImage}>
          {value ? 'Reupload' : 'Upload'} Picture
        </Button>
      </div>

      {loading && <CircularProgress color="primary" className={styles.loading} />}
    </div>
  );
};
